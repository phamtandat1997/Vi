export const actions = {
  FETCH_FAILURE: '@TRADING/FETCH_FAILURE',
  ADD_ITEM: '@TRADING/ADD_ITEM',
  CLEAR: '@TRADING/CLEAR',
  SET_TIME_SYNC: '@TRADING/SET_TIME_SYNC',
  REMOVE_ITEM: '@TRADING/REMOVE_ITEM',
  RESET_ERROR: '@TRADING/RESET_ERROR',

  resetError: () => {
    return {
      type: actions.RESET_ERROR,
    };
  },

  addItem: (data) => {
    return {
      type: actions.ADD_ITEM,
      payload: data,
    };
  },

  setTimeSync: (data) => {
    return {
      type: actions.SET_TIME_SYNC,
      payload: data,
    };
  },

  removeItem: (data) => {
    return {
      type: actions.REMOVE_ITEM,
      payload: data,
    };
  },

  clear: () => {
    return {
      type: actions.CLEAR,
    };
  },

  fetchFailure: (error) => {
    return {
      type: actions.FETCH_FAILURE,
      payload: { error },
    };
  },

};