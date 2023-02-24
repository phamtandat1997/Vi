export const actions = {
  SET_MARKET_LIST: '@APP/SET_MARKET_LIST',
  SET_MARKET_ID: '@APP/SET_MARKET_ID',
  GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP: '@APP/GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP',
  GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP_SUCCESS: '@APP/GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP_SUCCESS',
  FETCH_FAILURE: '@APP/FETCH_FAILURE',
  SET_BARCODE_FORMAT_BY_SUPER_MARKET: '@APP/SET_BARCODE_FORMAT_BY_SUPER_MARKET',
  SET_VERSION: '@APP/SET_VERSION',
  GET_BARCODE_FORMAT_BY_SUPER_MARKET_SYSTEM: '@APP/GET_BARCODE_FORMAT_BY_SUPER_MARKET_SYSTEM',
  RESET_ERROR: '@APP/RESET_ERROR',
  ENABLE_SEND_BATTERY_INFO: '@APP/ENABLE_SEND_BATTERY_INFO',
  DIS_ENABLE_SEND_BATTERY_INFO: '@APP/DIS_ENABLE_SEND_BATTERY_INFO',
  SET_BATTERY_PERCENT: '@APP/SET_BATTERY_PERCENT',
  SET_SCHEDULER_BATTERY_INFO: '@APP/SET_SCHEDULER_BATTERY_INFO',

  resetError: () => {
    return {
      type: actions.RESET_ERROR,
    };
  },

  setBatteryPercent: (data) => {
    return {
      type: actions.SET_BATTERY_PERCENT,
      payload: data,
    };
  },

  setSchedulerBatteryInfo: (data) => {
    return {
      type: actions.SET_SCHEDULER_BATTERY_INFO,
      payload: data,
    };
  },

  enableSendBatteryInfo: () => {
    return {
      type: actions.ENABLE_SEND_BATTERY_INFO,
    };
  },

  disEnableSendBatteryInfo: () => {
    return {
      type: actions.DIS_ENABLE_SEND_BATTERY_INFO,
    };
  },

  getProductBarcodeSupermarketLookup: () => {
    return {
      type: actions.GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP,
    };
  },

  setVersion: (data) => {
    return {
      type: actions.SET_VERSION,
      payload: data,
    };
  },

  setMarketList: (data) => {
    return {
      type: actions.SET_MARKET_LIST,
      data,
    };
  },
  setMarketId: (id) => {
    return {
      type: actions.SET_MARKET_ID,
      id,
    };
  },

  fetchFailure: (error) => {
    return {
      type: actions.FETCH_FAILURE,
      payload: { error },
    };
  },

};
