import { Map } from 'immutable';
import { actions } from './actions';
import CommonService from '../../utils/CommonService';

const maxRow = 10;
const _defaultState = {
  saleBarcode: null,
  returnBarcode: null,
};

const initialState = new Map(_defaultState);

export default (state = initialState, action) => {
  let saleObject = Object.assign({}, state.get('saleBarcode'));
  let returnObject = Object.assign({}, state.get('returnBarcode'));
  switch (action.type) {
    case actions.APPEND_SALE_BARCODE:
      saleObject[action.data.id] = action.data;
      return state.set('saleBarcode', CommonService.filterEntities(saleObject, maxRow));
    case actions.REMOVE_SALE_BARCODE:
      const cloneSaleObject = { ...saleObject };
      if (cloneSaleObject.hasOwnProperty(action.id)) {
        delete cloneSaleObject[action.id];
      }
      return state.set('saleBarcode', cloneSaleObject);
    case actions.TOGGLE_SALE_BARCODE:
      if (saleObject.hasOwnProperty(action.id)) {
        saleObject[action.id].status = !saleObject[action.id].status;
        saleObject[action.id].loading = false;
      }
      return state.set('saleBarcode', saleObject);
    case actions.CLEAR_SALE_BARCODE:
      return state.set('saleBarcode', null);
    case actions.APPEND_RETURN_BARCODE:
      returnObject[action.data.id] = action.data;
      return state.set('returnBarcode', CommonService.filterEntities(returnObject, maxRow));
    case actions.REMOVE_RETURN_BARCODE:
      const cloneReturnObject = { ...returnObject };
      if (cloneReturnObject.hasOwnProperty(action.id)) {
        delete cloneReturnObject[action.id];
      }
      return state.set('returnBarcode', cloneReturnObject);
    case actions.TOGGLE_RETURN_BARCODE:
      if (returnObject.hasOwnProperty(action.id)) {
        returnObject[action.id].status = !returnObject[action.id].status;
      }
      return state.set('returnBarcode', returnObject);
    case actions.CLEAR_RETURN_BARCODE:
      return state.set('returnBarcode', null);
    default:
      return state;
  }
}