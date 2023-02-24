import { Map } from 'immutable';
import { actions } from './actions';

const _defaultState = {
  marketList: [],
  selectedMarket: 0,
  productIdFromBarcode: {},
  error: null,
  barcodeFormat: null,
  version: 'nois-0',
  mustSendBatteryInfo: true,
  batteryPercent: 15,
  scheduleSendBatteryInfo: ['6h00', '6h30', '7h00', '7h30', '8h00', '8h30', '9h00', '9h30', '10h00', '10h30', '11h00', '11h30', 
    '12h00', '12h30', '13h00', '13h30', '14h00', '14h30', '15h00', '15h30', '16h00', '16h30', '17h00', '17h30', '18h00', '18h30', '19h00', '19h30', '20h00', '20h30'],
};

const initialState = new Map(_defaultState);

export default (state = initialState, action) => {

  switch (action.type) {

    case actions.RESET_ERROR:
      return state.set('error', null);

    case actions.SET_BATTERY_PERCENT:
      return state.set('batteryPercent', action.payload);

    case actions.SET_SCHEDULER_BATTERY_INFO:
      return state.set('scheduleSendBatteryInfo', action.payload);

    case actions.ENABLE_SEND_BATTERY_INFO:
      return state.set('mustSendBatteryInfo', true);

    case actions.DIS_ENABLE_SEND_BATTERY_INFO:
      return state.set('mustSendBatteryInfo', false);

    case actions.SET_MARKET_LIST:
      return state.set('marketList', action.data);

    case actions.SET_VERSION:
      return state.set('version', action.payload);

    case actions.SET_MARKET_ID:
      return state.set('selectedMarket', +action.id || 0);

    case actions.SET_BARCODE_FORMAT_BY_SUPER_MARKET:
      return state.set('barcodeFormat', action.payload);

    case action.GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP:
      return state.set('error', null);

    case actions.GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP_SUCCESS:
      return state.set('productIdFromBarcode', action.payload).set('error', null);

    case actions.FETCH_FAILURE:
      return state.set('error', action.payload);

    default:
      return state;
  }
}
