import moment from 'moment';

import { Store } from '../store';
import HttpService from '../utils/HttpService';
import fromCustomer from '../store/customer';
import fromKitchen from '../store/kitchen';
import fromPackage from '../store/packaging';
import TransactionType from '../constants/TransactionType';
import SoundService from '../utils/SoundService';
import Audio from '../constants/Audio';
import { LoadingSpinner } from '../components/loadingSpinner';
import { Dialog } from '../components/dialog';
import { Translate } from '../components/I18n';

export default class ReturnFactory {

  static async addItem3(barcode, type) {
    try {
      const marketId = Store.getState().app.get('selectedMarket');
      let barcodeObj = {
        id: 0,
        date: moment().format('HH:mm:ss'),
        barcode: '',
        name: '',
        weight: 0,
      };
      LoadingSpinner.show();

      const entityResultList = await HttpService.post('/purchases', {
        purchaseEditList: [
          {
            supermarketId: marketId,
            statusId: type,
            barcode,
            ScannedTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
      }).
        then(response => response.inserPurchasetEntityResultList).
        catch(error => {
          throw error;
        });

      if (entityResultList && entityResultList.length > 0) {
        barcodeObj = {
          ...barcodeObj,
          ...entityResultList[0],
        };
        if (type === TransactionType.CUSTOMER_RETURN) {
          Store.dispatch(fromCustomer.actions.appendReturnBarcode(barcodeObj));
        } else if (type === TransactionType.KITCHEN_RETURN) {
          Store.dispatch(fromKitchen.actions.appendReturnBarcode(barcodeObj));
        } else if (type === TransactionType.PACKAGING_RETURN) {
          Store.dispatch(fromPackage.actions.appendReturnBarcode(barcodeObj));
        }
      }

      SoundService.play(Audio.SCAN_SUCCESS);

      LoadingSpinner.hide();
    } catch (e) {
      LoadingSpinner.hide();
      SoundService.play(Audio.SCAN_FAIL);
    }
  }

  static removeItem(id, type) {
    if (type === TransactionType.CUSTOMER_RETURN) {
      Store.dispatch(fromCustomer.actions.removeReturnBarcode(id));
    } else if (type === TransactionType.KITCHEN_RETURN) {
      Store.dispatch(fromKitchen.actions.removeReturnBarcode(id));
    } else if (type === TransactionType.PACKAGING_RETURN) {
      Store.dispatch(fromPackage.actions.removeReturnBarcode(id));
    }
  }

  static async returnItem(id, type) {
    try {
      LoadingSpinner.show();
      await HttpService.delete(`/purchases/${id}`);

      this.removeItem(id, type);

      SoundService.play(Audio.SCAN_SUCCESS);

      LoadingSpinner.hide();

    } catch (e) {
      LoadingSpinner.hide();
      SoundService.play(Audio.SCAN_FAIL);
    }
  }

  static clearList(type) {
    if (type === TransactionType.CUSTOMER_RETURN) {
      Store.dispatch(fromCustomer.actions.clearReturnBarcode());
    } else if (type === TransactionType.KITCHEN_RETURN) {
      Store.dispatch(fromKitchen.actions.clearReturnBarcode());
    } else if (type === TransactionType.PACKAGING_RETURN) {
      Store.dispatch(fromPackage.actions.clearReturnBarcode());
    }
  }

  static onLogout() {
    try {
      //  Store.dispatch(fromApp.actions.clearReturnBarcode());
    } catch (e) {
      throw new Error(e);
    }
  }

  static removeAndReturnItem(item, type) {
    Dialog.confirm(Translate('CONFIRM_REMOVE_ITEM'), async (r) => {
      if (r) {
        await this.returnItem(item.id, type);
      }
    }, Translate('CONFIRM'), false, {
      confirmText: Translate('OK'),
      cancelText: Translate('CANCEL'),
      dismissOnTouchOutside: true,
    });
  }

  static clearAll(type) {
    Dialog.confirm(Translate('CONFIRM_CLEAR_LIST'), (r) => {
      if (r) {
        this.clearList(type);
      }
    }, Translate('CONFIRM'), false, {
      confirmText: Translate('OK'),
      cancelText: Translate('CANCEL'),
      dismissOnTouchOutside: true,
    });
  }
}
