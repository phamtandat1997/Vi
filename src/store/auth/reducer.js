import { Map } from 'immutable';
import { actions } from './actions';

const _defaultState = {
  currentUser: null,
  accessToken: '',
  refreshToken: '',
  isAuth: false,
  isLoading: false,
  error: null,
  role: '',
};

const initialState = new Map(_defaultState);

export default (state = initialState, action) => {

  switch (action.type) {

    case actions.RESET_ERROR:
      return state.set('error', null);

    case actions.RESET_IS_LOADING:
      return state.set('isLoading', false);

    case actions.LOGIN:
      return state.set('isLoading', true).set('error', null);

    case actions.SET_CURRENT_USER:
      return state.set('currentUser', action.payload).
        set('isAuth', true).
        set('isLoading', false).
        set('error', null);

    case actions.SET_IS_AUTH:
      return state.set('isAuth', action.isAuth);

    case actions.LOGIN_SUCCESSFUL:
      const { access_token, refresh_token, userRoles } = action.payload;
      return state.set('accessToken', access_token).
        set('refreshToken', refresh_token).
        set('error', null).
        set('role', userRoles);

    case actions.HANDLE_REFRESH_TOKEN: {
      const { access_token, refresh_token } = action.payload;
      return state.set('accessToken', access_token).
        set('refreshToken', refresh_token).
        set('error', null).
        set('isAuth', true);
    }

    case actions.LOGIN_FAILURE:
      const { error } = action.payload;
      return state.set('error', error).
        set('isLoading', false);

    case actions.LOG_OUT:
      return initialState;

    default:
      return state;
  }
}
