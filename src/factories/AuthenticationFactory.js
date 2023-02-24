import Config from '../constants/Config';
import { Store } from '../store';
import fromAuth from '../store/auth';
import HttpService from '../utils/HttpService';

export default class AuthenticationFactory {

  static login(data) {
    Store.dispatch(fromAuth.actions.login(data));
  }

  static async fetchLogin(data) {
    const model = {
      ...data,
      grant_type: 'password',
      client_secret: Config.client_secret,
      client_id: Config.client_id,
    };
    return await HttpService.post('/token', model, null, {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  static async fetchRefreshToken() {
    const model = {
      refresh_token: Store.getState().auth.get('refreshToken'),
      grant_type: 'refresh_token',
      client_secret: Config.client_secret,
      client_id: Config.client_id,
    };

    return await HttpService.post('/token', model, null, {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  static async fetchUserInfo({ userId }) {
    return await HttpService.get('/users/detailuser?id=' + userId);
  }

  static onLogout() {
    try {
      Store.dispatch(fromAuth.actions.logOut());
    } catch (e) {
      throw new Error(e);
    }
  }

  static reset() {
    const isLoading = Store.getState().auth.get('isLoading');
    const error = Store.getState().auth.get('error');

    if (!!isLoading) {
      Store.dispatch(fromAuth.actions.resetIsLoading());
    }

    if (error !== null) {
      Store.dispatch(fromAuth.actions.resetError());
    }
  }
}
