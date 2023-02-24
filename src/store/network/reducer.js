import { Map } from 'immutable';
import {actions} from './actions';

const _defaultState = {
  isConnected: true
};

const initialState = new Map(_defaultState);

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_IS_CONNECTED:
      return state.set('isConnected', action.data);
    default:
      return state;
  }
}