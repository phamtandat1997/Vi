import Config from '../constants/Config';
import { Dialog } from '../components/dialog';
import { Store } from '../store';
import AuthenticationFactory from '../factories/AuthenticationFactory';
import fromAuth from '../store/auth';

const API_URL = Config.API_URL;

export default class HttpService {

  static toastError(e) {
    let res = e.response;
    let message = e.message || '';

    if (message === 'Network request failed' || /^{/.test(message)) {
      Dialog.alertError('Network request failed');
      return;
    }

    if (res && res.status === 404) {
      // let error = res ? res.json() : {message: ''};
      Dialog.alertError(`${res.status} - Request not found`);
    } else if (res && res.status === 500) {
      // let error = res ? res.json() : {message: ''};
      Dialog.alertError(`500 - Server Internal Error`);
    } else if (res && res.status === 400) {
      // let error = res ? res.json() : {message: ''};
      Dialog.alertError(
        `${res.status}${message ? ` - ${message}` : ''}`);
    } else {
      Dialog.alertError(
        `${message.length > 0 ? message : 'Uncaught error'}`);
    }
  }

  static processMessage(jsonResult) {
    let errorMessage = '';
    if (jsonResult && jsonResult.errors) {
      errorMessage = this.processMessage(jsonResult.errors);
    } else if (jsonResult && jsonResult.Message) {
      errorMessage = this.processMessage(jsonResult.Message);
    } else if (jsonResult && jsonResult.message) {
      errorMessage = this.processMessage(jsonResult.message);
    } else if (jsonResult && jsonResult.error_description) {
      errorMessage = this.processMessage(jsonResult.error_description);
    } else if (jsonResult && jsonResult.error) {
      errorMessage = this.processMessage(jsonResult.error);
    } else if (jsonResult && jsonResult.errorMessages) {
      errorMessage = this.processMessage(jsonResult.errorMessages);
    } else {
      errorMessage = jsonResult || '';
    }
    if (typeof errorMessage === 'string') {
      return errorMessage;
    } else if (Array.isArray(errorMessage)) {
      return errorMessage.join('\n');
    }
    return JSON.stringify(errorMessage);
  }

  static async checkStatus(response, resolve, request, reject, config) {
    const JSON = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (__DEV__) {
        console.log('%c [HTTP Interceptor Response]',
          'color: #248c1d; font-weight: bold', JSON);
      }
      return resolve(JSON);
    } else {
      if (response.status === 401) {
        try {
          const data = await AuthenticationFactory.fetchRefreshToken();
          Store.dispatch(fromAuth.actions.handleRefreshToken(data));
          const requestConfig = {
            ...request.config,
            headers: this.generateHeader(config),
          };

          fetch(request.url, requestConfig).then(async (response) => {
            const JSON = await response.json();
            resolve(JSON);
          }).catch(error => {
            throw error;
          });
        } catch (error) {
          const errorMessage = 'Unauthorized ';
          reject(errorMessage);
        }
      } else {
        const errors = {
          error: JSON || 'Network request failed',
          status: response.status,
        };
        if (__DEV__) {
          console.log('%c [HTTP Interceptor Request Error]',
            'color: red; font-weight: bold', errors);
        }
        if (!config || !config.disabledToast) {
          // TODO translate error key here, implement later
          this.toastError({ response, message: this.processMessage(JSON) });
        }
        reject(errors);
      }
    }
  }

  static JSON_to_URLEncoded(element, key, list) {
    list = list || [];
    if (typeof (element) === 'object') {
      for (const idx in element)
        this.JSON_to_URLEncoded(element[idx], key ? key + '[' + idx + ']' : idx,
          list);
    } else {
      list.push(key + '=' + encodeURIComponent(element));
    }
    return list.join('&');
  }

  static _convertToQueryString(obj) {
    obj = obj || {};
    let result = [];
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        result.push(`${i}=${obj[i]}`);
      }
    }
    return result.join('&');
  }

  static getAuthData() {
    return Store.getState().auth.toJS();
  }

  static getToken() {
    const authData = this.getAuthData();
    return authData['accessToken'];
  }

  static generateHeader(config) {
    const extraHeaders = config && config.header;
    const token = this.getToken();
    const header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    return header;
  }

  static fetch(requestUrl, requestConfig, config) {
    const self = this;
    return new Promise((resolve, reject) => {
      if (__DEV__) {
        const request = {
          requestUrl,
          requestConfig,
          config,
        };
        console.log('%c [HTTP Interceptor Request]',
          'color: blue; font-weight: bold', request);
      }
      fetch(requestUrl, requestConfig).then(async (response) => {
        try {
          delete requestConfig.headers;
          await self.checkStatus(response, resolve, {
            url: requestUrl,
            config: requestConfig,
          }, reject, config);
        } catch (e) {
          reject(e);
        }
      }).catch((e) => {
        if (__DEV__) {
          console.log('GET catch.... 3', e);
        }
        const isConnected = Store.getState().network.get('isConnected');
        if (!!isConnected) {
          self.toastError(e);
        }
        reject(e);
      });
    });
  }

  static async get(url, qs, config) {
    const queryString = this._convertToQueryString(qs);
    const header = this.generateHeader(config);
    const requestConfig = {
      method: 'GET',
      headers: header,
    };
    const requestUrl = `${API_URL}${url}${queryString.length ?
      ('?' + queryString) : ''}`;

    return this.fetch(requestUrl, requestConfig, config);
  }

  static async post(url, body, qs, config) {
    const queryString = this._convertToQueryString(qs);
    const header = this.generateHeader(config);
    const requestUrl = `${API_URL}${url}${queryString.length ?
      ('?' + queryString) : ''}`;
    const requestConfig = {
      method: 'POST',
      headers: header,
      body: config && config.json ?
        body :
        header['Content-Type'] === 'application/x-www-form-urlencoded' ?
          this.JSON_to_URLEncoded(body) : JSON.stringify(body),
    };

    return this.fetch(requestUrl, requestConfig, config);
  }

  static async patch(url, body, qs, config) {
    const queryString = this._convertToQueryString(qs);
    const header = this.generateHeader(config);
    const requestUrl = `${API_URL}${url}${queryString.length ?
      ('?' + queryString) : ''}`;
    const requestConfig = {
      method: 'PATCH',
      headers: header,
      body: JSON.stringify(body),
    };
    return this.fetch(requestUrl, requestConfig, config);
  }

  static async put(url, body, qs, config) {
    const queryString = this._convertToQueryString(qs);
    const header = this.generateHeader(config);
    const requestUrl = `${API_URL}${url}${queryString.length ?
      ('?' + queryString) : ''}`;
    const requestConfig = {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(body),
    };
    return this.fetch(requestUrl, requestConfig, config);
  }

  static async delete(url, qs, config) {
    const queryString = this._convertToQueryString(qs);
    const header = this.generateHeader(config);
    const requestUrl = `${API_URL}${url}${queryString.length ?
      ('?' + queryString) : ''}`;
    const requestConfig = {
      method: 'DELETE',
      headers: header,
    };
    return this.fetch(requestUrl, requestConfig, config);
  }
}