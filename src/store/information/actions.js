export const actions = {
  GET_INFORMATION: '@INFO/GET_INFORMATION',
  GET_INFORMATION_SUCCESS: '@INFO/GET_INFORMATION_SUCCESS',
  FETCH_FAILURE: '@INFO/FETCH_FAILURE',
  GET_OLD_INFORMATION: '@INFO/GET_OLD_INFORMATION',
  GET_NEW_INFORMATION: '@INFO/GET_NEW_INFORMATION',
  GET_NEW_INFORMATION_SUCCESS: '@INFO/GET_NEW_INFORMATION_SUCCESS',
  GET_OLD_INFORMATION_SUCCESS: '@INFO/GET_OLD_INFORMATION_SUCCESS',

  getOldInformation: (data) => {
    return {
      type: actions.GET_OLD_INFORMATION,
      payload: data,
    };
  },

  getNewInformation: (data) => {
    return {
      type: actions.GET_NEW_INFORMATION,
      payload: data,
    };
  },

  getInformation: (data) => {
    return {
      type: actions.GET_INFORMATION,
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