export const actions = {
  GET_INVENTORIES: '@INVENTORY/GET_INVENTORIES',
  GET_INVENTORIES_SUCCESS: '@INVENTORY/GET_INVENTORIES_SUCCESS',
  GET_NEW_INVENTORIES: '@INVENTORY/GET_NEW_INVENTORIES',
  GET_NEW_INVENTORIES_SUCCESS: '@INVENTORY/GET_NEW_INVENTORIES_SUCCESS',
  GET_OLD_INVENTORIES: '@INVENTORY/GET_OLD_INVENTORIES',
  GET_OLD_INVENTORIES_SUCCESS: '@INVENTORY/GET_OLD_INVENTORIES_SUCCESS',
  FETCH_FAILURE: '@INVENTORY/FETCH_FAILURE',

  getInventories: (data) => {
    return {
      type: actions.GET_INVENTORIES,
      payload: data,
    };
  },

  getNewInventories: (data) => {
    return {
      type: actions.GET_NEW_INVENTORIES,
      payload: data,
    };
  },

  getOldInventories: (data) => {
    return {
      type: actions.GET_OLD_INVENTORIES,
      payload: data,
    };
  },

  fetchFailure: (error) => {
    return {
      type: actions.FETCH_FAILURE,
      payload: { error },
    };
  },
};