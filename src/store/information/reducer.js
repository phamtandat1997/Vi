import { Map } from 'immutable';
import { actions as ActionTypes } from './actions';

const _defaultState = {
  error: null,
  entities: {},
  isLoading: false,
  isGettingOldData: false,
  hasMoreData: true,
  refreshing: false,
  note: null
};

const initialState = new Map(_defaultState);

export default (state = initialState, action) => {

  const entities = Object.assign({}, state.get('entities'));

  switch (action.type) {

    case ActionTypes.GET_INFORMATION: {
      return state.set('isLoading', true);
    }

    case ActionTypes.GET_INFORMATION_SUCCESS: {
      const { data, total, note } = action.payload;
      const lengthEntities = Object.keys(data).length;

      return state.set('entities', data).
          set('note', note).
          set('isLoading', false).
          set('isGettingOldData', false).
          set('refreshing', false).
          set('hasMoreData', total !== lengthEntities).
          set('error', null);
    }

    case ActionTypes.GET_OLD_INFORMATION: {
      return state.set('isGettingOldData', true).set('error', null);
    }

    case ActionTypes.GET_NEW_INFORMATION: {
      return state.set('refreshing', true).set('error', null);
    }

    case ActionTypes.GET_OLD_INFORMATION_SUCCESS: {
      const { total, note } = action.payload;
      const data = { ...entities, ...action.payload.data };
      const lengthEntities = Object.keys(data).length;

      return state.set('entities', data).
          set('note', note).
          set('isLoading', false).
          set('isGettingOldData', false).
          set('refreshing', false).
          set('hasMoreData', total !== lengthEntities).
          set('error', null);
    }

    case ActionTypes.GET_NEW_INFORMATION_SUCCESS: {
      const { data, total, note } = action.payload;
      const lengthEntities = Object.keys(data).length;

      return state.set('entities', data).
          set('note', note).
          set('isLoading', false).
          set('isGettingOldData', false).
          set('refreshing', false).
          set('hasMoreData', total !== lengthEntities).
          set('error', null);
    }

    case ActionTypes.FETCH_FAILURE: {
      const { error } = action.payload;
      return state.set('error', error).set('isLoading', false);
    }

    default:
      return state;
  }
}
