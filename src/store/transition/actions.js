export const actions = {
  GET_TRANSITION: '@TRANSITION/GET_TRANSITION',
  GET_TRANSITION_SUCCESS: '@TRANSITION/GET_TRANSITION_SUCCESS',
  GET_NEW_TRANSITION: '@TRANSITION/GET_NEW_TRANSITION',
  GET_NEW_TRANSITION_SUCCESS: '@TRANSITION/GET_NEW_TRANSITION_SUCCESS',
  GET_OLD_TRANSITION: '@TRANSITION/GET_OLD_TRANSITION',
  GET_OLD_TRANSITION_SUCCESS: '@TRANSITION/GET_OLD_TRANSITION_SUCCESS',
  GET_TRANSITION_DETAIL: '@TRANSITION/GET_TRANSITION_DETAIL',
  GET_TRANSITION_DETAIL_SUCCESS: '@TRANSITION/GET_TRANSITION_DETAIL_SUCCESS',
  FETCH_FAILURE: '@TRANSITION/FETCH_FAILURE',
  MARK_RECEIVED: '@TRANSITION/MARK_RECEIVED',

  getTransition: (data) => {
    return {
      type: actions.GET_TRANSITION,
      payload: data,
    };
  },

  getNewTransition: (data) => {
    return {
      type: actions.GET_NEW_TRANSITION,
      payload: data,
    };
  },

  getOldTransition: (data) => {
    return {
      type: actions.GET_OLD_TRANSITION,
      payload: data,
    };
  },

  getTransitionDetail: (data) => {
    return {
      type: actions.GET_TRANSITION_DETAIL,
      payload: data,
    };
  },

  markReceived: (id) => {
    return {
      type: actions.MARK_RECEIVED,
      payload: { id },
    };
  },

  fetchFailure: (error) => {
    return {
      type: actions.FETCH_FAILURE,
      payload: { error },
    };
  },
};