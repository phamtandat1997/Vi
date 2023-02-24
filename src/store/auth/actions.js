export const actions = {
  SET_CURRENT_USER: '@AUTH/SET_CURRENT_USER',
  SET_IS_AUTH: '@AUTH/SET_IS_AUTH',
  LOG_OUT: '@AUTH/LOG_OUT',
  LOGIN_SUCCESSFUL: '@AUTH/LOGIN_SUCCESSFUL',
  FETCH_FAILURE: '@AUTH/FETCH_FAILURE',
  LOGIN_FAILURE: '@AUTH/LOGIN_FAILURE',
  LOGIN: '@AUTH/LOGIN',
  HANDLE_REFRESH_TOKEN: '@AUTH/HANDLE_REFRESH_TOKEN',
  RESET_IS_LOADING: '@AUTH/RESET_IS_LOADING',
  RESET_ERROR: '@AUTH/RESET_ERROR',

  resetIsLoading: () => {
    return {
      type: actions.RESET_IS_LOADING,
    };
  },

  resetError: () => {
    return {
      type: actions.RESET_ERROR,
    };
  },

  login: (data) => {
    return {
      type: actions.LOGIN,
      payload: data,
    };
  },

  setCurrentUser: (user) => {
    return {
      type: actions.SET_CURRENT_USER,
      user,
    };
  },
  setIsAuth: (isAuth) => {
    return {
      type: actions.SET_IS_AUTH,
      isAuth,
    };
  },
  logOut: () => {
    return {
      type: actions.LOG_OUT,
    };
  },
  loginSuccess: (data) => {
    return {
      type: actions.LOGIN_SUCCESSFUL,
      data,
    };
  },

  handleRefreshToken: (data) => {
    return {
      type: actions.HANDLE_REFRESH_TOKEN,
      payload: data,
    };
  },
};
