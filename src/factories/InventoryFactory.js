import HttpService from '../utils/HttpService';
import { Store } from '../store';
import { LoadingSpinner } from '../components/loadingSpinner';
import { Dialog } from '../components/dialog';
import Navigation from '../utils/NavigationService';
import fromInventory from '../store/inventory';

export default class InventoryFactory {

  static getInventories(data) {
    Store.dispatch(fromInventory.actions.getInventories(data));
  }

  static getNewInventories(data) {
    Store.dispatch(fromInventory.actions.getNewInventories(data));
  }

  static getOldInventories(data) {
    Store.dispatch(fromInventory.actions.getOldInventories(data));
  }

  static async fetchInventories(params) {
    return await HttpService.get('/inventories', {
      ...params,
      supermarketId: Store.getState().app.get('selectedMarket'),
    });
  }

  static async fetchMakeInventory(products, applyDate) {
    return await HttpService.post('/inventories/AddList', {
      products,
      applyDate,
      supermarketId: Store.getState().app.get('selectedMarket'),
    });
  }

  static async makeInventory(products, applyDate) {
    LoadingSpinner.show();
    try {
      await this.fetchMakeInventory(products, applyDate);
      LoadingSpinner.hide();
      Dialog.alertSuccess('Thông tin nhập hàng tồn kho đã được thực hiện',
        'Thành công');

      setTimeout(() => {
        Dialog.dismiss();
        Navigation.goBack();
      }, 3000);
    } catch (e) {
      LoadingSpinner.hide();
      Dialog.alertError('Không thể nhập hàng tồn kho. Vui lòng thử lại sau',
        'Lỗi');
    }
  }
}