export const actions = {
  GET_REPORT: '@REPORT/GET_REPORT',
  GET_REPORT_SUCCESS: '@REPORT/GET_REPORT_SUCCESS',
  GET_NEW_REPORT: '@REPORT/GET_NEW_REPORT',
  GET_NEW_REPORT_SUCCESS: '@REPORT/GET_NEW_REPORT_SUCCESS',
  GET_OLD_REPORT: '@REPORT/GET_OLD_REPORT',
  GET_OLD_REPORT_SUCCESS: '@REPORT/GET_OLD_REPORT_SUCCESS',
  FETCH_FAILURE: '@REPORT/FETCH_FAILURE',

  getReport: (data) => {
    return {
      type: actions.GET_REPORT,
      payload: data,
    };
  },

  getNewReport: (data) => {
    return {
      type: actions.GET_NEW_REPORT,
      payload: data,
    };
  },

  getOldReport: (data) => {
    return {
      type: actions.GET_OLD_REPORT,
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