import Config from '../constants/Config';
import { Dialog } from '../components/dialog';
import { actions as AuthActions } from '../store/auth/actions';
import { Store } from '../store';
import NavigationService from '../utils/NavigationService';

let inFlightAuthRequest = null;
let numberOfRetried = 0;
let maxRetry = 3;

export default class ApiService {
  constructor() {
    this.requests = [];
  }

  static async _toastError(e) {
    let res = e.response;
    console.log('_toastError', res);

    let message = e.message || '';
    console.log('_toastError message', message);

    if (message === 'Network request failed') {
      return;
    }

    if (res && res.status === 404) {
      // let error = res ? res.json() : {message: ''};
      Dialog.alertError(`${res.status} - Request not found`);
    }
    else if (res && res.status === 500) {
      // let error = res ? res.json() : {message: ''};
      Dialog.alertError(`500 - Server Internal Error`);
    }
    else if (res && res.status === 400) {
      // let error = res ? res.json() : {message: ''};
      Dialog.alertError(
          `${res.status}${message ? ` - ${message}` : ''}`);
    } else {
      Dialog.alertError(
          `${message.length > 0 ? message : 'Uncaught error'}`);
    }
  }

  static async _recall(request, resolve, reject, config) {
    request.config.headers = await this._generateHeader(config);
    fetch(request.url, request.config).then(async (response) => {
      try {
        delete request.config.headers;
        await this._checkStatus(response, resolve, request, reject, config);
      }
      catch (e) {
        console.log('RECALL catch....', e);
        reject(e);
      }
    });
  }

  static processMessage(jsonResult) {
    let errorMessage = '';
    if (jsonResult && jsonResult.errors) {
      errorMessage = this.processMessage(jsonResult.errors);
    }
    else if (jsonResult && jsonResult.Message) {
      errorMessage = this.processMessage(jsonResult.Message);
    }
    else if (jsonResult && jsonResult.message) {
      errorMessage = this.processMessage(jsonResult.message);
    }
    else if (jsonResult && jsonResult.error_description) {
      errorMessage = this.processMessage(jsonResult.error_description);
    }
    else if (jsonResult && jsonResult.error) {
      errorMessage = this.processMessage(jsonResult.error);
    }
    else if (jsonResult && jsonResult.errorMessages) {
      errorMessage = this.processMessage(jsonResult.errorMessages);
    }
    else {
      errorMessage = jsonResult || '';
    }

    if (typeof errorMessage === 'string') {
      return errorMessage;
    } else if (Array.isArray(errorMessage)) {
      return errorMessage.join('\n');
    }

    return JSON.stringify(errorMessage);
  }

  static async _checkStatus(response, resolve, request, reject, config) {

    let json = null;
    try {
      json = await response.json();
    } catch (e) {
    }
    // console.log('RESPONSE JSON', json);

    if ((json && json.status !== false) && response.status >= 200 &&
        response.status < 300) {
      return resolve(json);
    } else {
      let jsonResult = json;
      // If response is not ok
      if (response.status === 401) {
        numberOfRetried++;
        if (numberOfRetried > maxRetry) {
          numberOfRetried = 0;
          Store.dispatch(AuthActions.logOut());
          NavigationService.reset('Login');

          throw new Error('Session timed out, please sign in again!');
        }
        // and this response status is 401
        if (inFlightAuthRequest) { // Check if there is already a promise get new token
          // then handle the promise callback
          inFlightAuthRequest.then(async () => {
            // when promise get new token resolved, re-call the request
            await this._recall(request, resolve, reject, config);
          }, (err) => {
            console.log('inFlightAuthRequest error 1', err);
          }).catch((e) => {
            console.log('inFlightAuthRequest catch 1', e);
          });
          return;
        }
        try {
          // get new token by refresh token
          await this._refreshToken(reject);

          // then handle the promise callback
          inFlightAuthRequest.then(async () => {
            // when promise get new token resolved, re-call the request
            await this._recall(request, resolve, reject, config);
          }, (err) => {
            console.log('inFlightAuthRequest error 2', err);
          }).catch((e) => {
            console.log('inFlightAuthRequest catch 2', e);
          });
        } catch (e) {
          reject(e);
        }

        return response;
      }
      else if (response.status === 400) {
        console.log('Response', response);
        try {
          if (!response.bodyUsed) {
            jsonResult = await response.json();
            console.log('Response Json Result', jsonResult);
          }
        } catch (e) {
          console.log('_checkStatus await response.json()', e);
        }
        console.log('Response json', jsonResult);
      }

      let errorMessage = this.processMessage(jsonResult);

      let error = new Error(errorMessage);
      error.response = response;
      if (!config || !config.disabledToast) {
        // TODO translate error key here, implement later
        await this._toastError(error);
      }

      if (reject) {
        reject(error);
        return;
      }

      // Throw error
      throw error;
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
    const store = getStore();
    return store.getState().auth.toJS();
  }

  static _getToken() {
    const authData = this.getAuthData();
    return authData.accessToken;
  }

  static _getRefreshToken() {
    const authData = this.getAuthData();
    return authData.refreshToken;
  }

  static async _generateHeader(config) {
    const extraHeaders = config && config.header;
    let token = await this._getToken();
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    if (token) {
      header['Authorization'] = 'Bearer ' + token;
    }
    return header;
  }

  static async _refreshToken() {
    const store = getStore();
    let mess = 'Session timed out!';
    let refreshToken = await this._getRefreshToken();
    if (!refreshToken) {
      store.dispatch(AuthActions.logOut());
      NavigatorService.reset('Login');
      throw new Error(mess);
    }
    try {
      console.log('Get new token..');
      inFlightAuthRequest = this.post('/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_secret: Config.client_secret,
        client_id: Config.client_id,
      }, null, {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(async (res) => {
        store.dispatch(
            // AuthActions.setToken(res.data.accessToken, res.data.refreshToken));
            AuthActions.loginSuccess(res));
        return res;
      }, (err) => {
        console.log('get new token error', err);
      }).catch((e) => {
        console.log('get new token catch', e);
      });
    } catch (e) {
      console.log('get new token failed');
      store.dispatch(AuthActions.logOut());
      NavigatorService.reset('Login');
      throw new Error(mess);
    }
  }

  static async get(url, qs, config) {
    let self = this;
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader(config);
    let requestUrl = `${Config.API_URL}${url}${queryString.length ?
        ('?' + queryString) :
        ''}`;
    let requestConfig = {
      method: 'GET',
      headers: header,
    };
    return new Promise((resolve, reject) => {
      console.log('GET ' + requestUrl, requestConfig);
      fetch(requestUrl, requestConfig).then(async (response) => {
        try {
          delete requestConfig.headers;
          await this._checkStatus(response, resolve, {
            url: requestUrl,
            config: requestConfig,
          }, reject, config);
        }
        catch (e) {
          console.log('GET catch....', e);
          reject(e);
        }
      }).catch((e) => {
        console.log('GET catch.... 3', e);
        self._toastError(e);
        reject(e);
      });
    });
  }

  static async post(url, body, qs, config) {
    let self = this;
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader(config);
    let requestUrl = `${Config.API_URL}${url}${queryString.length ?
        ('?' + queryString) :
        ''}`;
    console.log(requestUrl);
    let requestConfig = {
      method: 'POST',
      headers: header,
      body: config && config.json ? body :
          header['Content-Type'] === 'application/x-www-form-urlencoded' ?
              this.JSON_to_URLEncoded(body) :
              JSON.stringify(body),
    };
    return new Promise((resolve, reject) => {
      console.log('POST ', requestUrl, requestConfig);
      fetch(requestUrl, requestConfig).then(async (response) => {
        try {
          delete requestConfig.headers;
          await this._checkStatus(response, resolve, {
            url: requestUrl,
            config: requestConfig,
          }, reject, config);
        }
        catch (e) {
          console.log('POST catch....', e);
          reject(e);
        }
      }).catch((e) => {
        console.log('POST catch.... 3', e);
        self._toastError(e);
        reject(e);
      });
    });
  }

  static async patch(url, body, qs, config) {
    let self = this;
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader(config);
    let requestUrl = `${Config.API_URL}${url}${queryString.length ?
        ('?' + queryString) :
        ''}`;
    let requestConfig = {
      method: 'PATCH',
      headers: header,
      body: JSON.stringify(body),
    };
    return new Promise((resolve, reject) => {
      console.log('PATCH ' + requestUrl, requestConfig);
      fetch(requestUrl, requestConfig).then(async (response) => {
        try {
          delete requestConfig.headers;
          await this._checkStatus(response, resolve, {
            url: requestUrl,
            config: requestConfig,
          }, reject, config);
        }
        catch (e) {
          console.log('PATCH catch....', e);
          reject(e);
        }
      }).catch((e) => {
        console.log('PATCH catch.... 3', e);
        self._toastError(e);
        reject(e);
      });
    });
  }

  static async put(url, body, qs, config) {
    let self = this;
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader(config);
    let requestUrl = `${Config.API_URL}${url}${queryString.length ?
        ('?' + queryString) :
        ''}`;
    let requestConfig = {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(body),
    };
    return new Promise((resolve, reject) => {
      // console.log('PUT ' + requestUrl, requestConfig);
      fetch(requestUrl, requestConfig).then(async (response) => {
        try {
          delete requestConfig.headers;
          await this._checkStatus(response, resolve, {
            url: requestUrl,
            config: requestConfig,
          }, reject, config);
        }
        catch (e) {
          console.log('PUT catch....', e);
          reject(e);
        }
      }).catch((e) => {
        console.log('PUT catch.... 3', e);
        self._toastError(e);
        reject(e);
      });
    });
  }

  static async delete(url, qs, config) {
    let self = this;
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader(config);
    let requestUrl = `${Config.API_URL}${url}${queryString.length ?
        ('?' + queryString) :
        ''}`;
    let requestConfig = {
      method: 'DELETE',
      headers: header,
    };
    return new Promise((resolve, reject) => {
      console.log('DELETE ' + requestUrl, requestConfig);
      fetch(requestUrl, requestConfig).then(async (response) => {
        try {
          delete requestConfig.headers;
          await this._checkStatus(response, resolve, {
            url: requestUrl,
            config: requestConfig,
          }, reject, config);
        }
        catch (e) {
          console.log('DELETE catch....', e);
          reject(e);
        }
      }).catch((e) => {
        console.log('DELETE catch.... 3', e);
        self._toastError(e);
        reject(e);
      });
    });
  }

  static async uploadImage(imageUri) {
    let header = await this._generateHeader();
    let self = this;
    let photo = {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${new Date().getTime().toString()}.jpg`,
    };

    header['Content-Type'] = 'multipart/form-data';
    let body = new FormData();
    body.append('file', photo);

    const requestConfig = {
      method: 'POST',
      body: body,
      headers: header,
    };

    let requestUrl = `${Config.API_URL}/api/common/upload`;

    return new Promise((resolve, reject) => {
      fetch(requestUrl, requestConfig).then(async (response) => {
        try {
          delete requestConfig.headers;
          await this._checkStatus(response, resolve, {
            url: requestUrl,
            config: requestConfig,
          }, reject);
        }
        catch (e) {
          console.log('Upload catch....', e);
          reject(e);
        }
      }).catch((e) => {
        console.log('Upload catch.... 3', e);
        self._toastError(e);
        reject(e);
      });
    });
  }
}