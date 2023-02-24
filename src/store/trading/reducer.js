import { Map } from 'immutable';
import { actions } from './actions';

const _defaultState = {
  entities: [],
  error: null,
  timeSync: 120, // 2 minutes
};

const initialState = new Map(_defaultState);

export default (state = initialState, action) => {
  const cloneEntities = state.get('entities');
  switch (action.type) {

    case actions.RESET_ERROR:
      return state.set('error', null);

    case actions.ADD_ITEM:
      return state.set('entities', [...cloneEntities, action.payload]);

    case actions.REMOVE_ITEM:
      return state.set('entities',
        cloneEntities.filter(item => item.barcode !== action.payload.barcode));

    case actions.SET_TIME_SYNC:
      return state.set('timeSync', action.payload);

    case actions.FETCH_FAILURE:
      return state.set('error', action.payload);

    case actions.CLEAR:
      return state.set('entities', []);

    default:
      return state;
  }
}