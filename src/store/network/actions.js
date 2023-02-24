export const actions = {
  SET_IS_CONNECTED: '@NETWORK/SET_IS_CONNECTED',

  setIsConnected: (data) => {
    return {
      type: actions.SET_IS_CONNECTED,
      data,
    };
  },
};