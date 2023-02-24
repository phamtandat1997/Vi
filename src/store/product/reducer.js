import { Map } from 'immutable';
import { actions } from './actions';

const _defaultState = {
  error: null,
  entities: {},
  isLoading: false,
};

const initialState = new Map(_defaultState);

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_PRODUCTS_SUCCESS:
      return state.set('entities', action.payload).
        set('error', null).
        set('isLoading', false);

    case action.FETCH_FAILURE:
      return state.set('error', action.payload).set('isLoading', false);

    default:
      return state;
  }
}