import HttpService from '../utils/HttpService';
import { Store } from '../store';
import fromInformation from '../store/information';

export default class InfoFactory {

  static getInformation(data) {
    Store.dispatch(fromInformation.actions.getInformation(data));
  }

  static async fetchInformation(data) {
    return await HttpService.get('/productsupermarkets/mobile', data);
  }

  static getNewInformation(data) {
    Store.dispatch(fromInformation.actions.getNewInformation(data));
  }

  static getOldInformation(data) {
    Store.dispatch(fromInformation.actions.getOldInformation(data));
  }

  static async fetchCreateOrUpdateNote(data) {
    const model = {
      ...data,
      noteStatusId: 0,
      supermarketId: Store.getState().app.get('selectedMarket'),
    };
    if (data.id) {
      return await HttpService.put('/notes', model);
    }
    return await HttpService.post('/notes', model);
  }
}