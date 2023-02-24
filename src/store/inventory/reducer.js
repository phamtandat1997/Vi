import { Map } from 'immutable';
import { actions as ActionTypes } from './actions';

const _defaultState = {
  error: null,
  entities: {},
  isLoading: false,
  isGettingOldData: false,
  hasMoreData: true,
  refreshing: false,
};

const initialState = new Map(_defaultState);

export default (state = initialState, action) => {

  let entities = Object.assign({}, state.get('entities'));

  switch (action.type) {

    case ActionTypes.GET_INVENTORIES:
      return state.set('isLoading', true).set('error', null);

    case ActionTypes.GET_INVENTORIES_SUCCESS:
      const { data, total } = action.payload;
      const lengthEntities = Object.keys(data).length;

      return state.set('entities', data).
        set('isLoading', false).
        set('isGettingOldData', false).
        set('refreshing', false).
        set('hasMoreData', total !== lengthEntities).
        set('error', null);

    case ActionTypes.GET_OLD_INVENTORIES: {
      return state.set('isGettingOldData', true).set('error', null);
    }

    case ActionTypes.GET_NEW_INVENTORIES: {
      return state.set('refreshing', true).set('error', null);
    }

    case ActionTypes.GET_OLD_INVENTORIES_SUCCESS: {
      const { total } = action.payload;
      const data = { ...entities, ...action.payload.data };
      const lengthEntities = Object.keys(data).length;

      return state.set('entities', data).
        set('isLoading', false).
        set('isGettingOldData', false).
        set('refreshing', false).
        set('hasMoreData', total !== lengthEntities).
        set('error', null);
    }

    case ActionTypes.GET_NEW_INVENTORIES_SUCCESS: {
      const { data, total } = action.payload;
      const lengthEntities = Object.keys(data).length;

      return state.set('entities', data).
        set('isLoading', false).
        set('isGettingOldData', false).
        set('refreshing', false).
        set('hasMoreData', total !== lengthEntities).
        set('error', null);
    }

    case ActionTypes.FETCH_FAILURE:
      return state.set('error', action.payload).set('isLoading', false);

    default:
      return state;
  }
}