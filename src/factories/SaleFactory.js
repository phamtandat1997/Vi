import I18n from 'react-native-i18n';
import moment from 'moment';

import { Store } from '../store';
import HttpService from '../utils/HttpService';
import fromCustomer from '../store/customer';
import fromKitchen from '../store/kitchen';
import fromPackage from '../store/packaging';
import fromTrading from '../store/trading';
import Strings from '../components/I18n/Strings';
import TransactionType from '../constants/TransactionType';
import ProductFactory from './ProductFactory';
import { DropDown } from '../components/dropdownAlert';
import SoundService from '../utils/SoundService';
import Audio from '../constants/Audio';
import { LoadingSpinner } from '../components/loadingSpinner';
import { Dialog } from '../components/dialog';
import { Translate } from '../components/I18n';

export default class SaleFactory {

  static addItem2(barcode, type) {
    const barcodeObj = ProductFactory.generateSaleOrReturnProduct(barcode,
      true);
    const marketId = Store.getState().app.get('selectedMarket');

    if (barcodeObj) {
      LoadingSpinner.show();
      if (type === TransactionType.CUSTOMER) {
        Store.dispatch(fromCustomer.actions.appendSaleBarcode(barcodeObj));
        SoundService.play(Audio.SCAN_SUCCESS);
      } else if (type === TransactionType.KITCHEN) {
        Store.dispatch(fromKitchen.actions.appendSaleBarcode(barcodeObj));
        SoundService.play(Audio.SCAN_SUCCESS);
      } else if (type === TransactionType.PACKAGING) {
        Store.dispatch(fromPackage.actions.appendSaleBarcode(barcodeObj));
        SoundService.play(Audio.SCAN_SUCCESS);
      }

      Store.dispatch(fromTrading.actions.addItem({
        supermarketId: marketId,
        statusId: type,
        barcode,
        ScannedTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }));

      LoadingSpinner.hide();

    } else {
      DropDown.showErrorAlert(I18n.t(Strings.ERROR_BARCODE));
      SoundService.play(Audio.SCAN_FAIL);
    }
  }

  static removeItem(id, type) {
    if (type === TransactionType.CUSTOMER) {
      Store.dispatch(fromCustomer.actions.removeSaleBarcode(id));
    } else if (type === TransactionType.KITCHEN) {
      Store.dispatch(fromKitchen.actions.removeSaleBarcode(id));
    } else if (type === TransactionType.PACKAGING) {
      Store.dispatch(fromPackage.actions.removeSaleBarcode(id));
    }
  }

  static async returnItem(item, type) {
    try {
      LoadingSpinner.show();

      const marketId = Store.getState().app.get('selectedMarket');
      const { barcode } = item;

      await HttpService.post('/purchases', {
        purchaseEditList: [
          {
            supermarketId: marketId,
            // For return type + 1
            statusId: type + 1,
            barcode,
          },
        ],
      });

      SoundService.play(Audio.SCAN_SUCCESS);

      this.removeItem(item.id, type);

      LoadingSpinner.hide();
    } catch (error) {
      LoadingSpinner.hide();
      SoundService.play(Audio.SCAN_FAIL);
    }
  }

  static clearList(type) {
    if (type === TransactionType.CUSTOMER) {
      Store.dispatch(fromCustomer.actions.clearSaleBarcode());
    } else if (type === TransactionType.KITCHEN) {
      Store.dispatch(fromKitchen.actions.clearSaleBarcode());
    } else if (type === TransactionType.PACKAGING) {
      Store.dispatch(fromPackage.actions.clearSaleBarcode());
    }
  }

  static onLogout() {
    try {
      //  Store.dispatch(fromApp.actions.clearSaleBarcode());
    } catch (e) {
      throw new Error(e);
    }
  }

  static removeOrReturnSaleItem(item, type) {
    if (item.status) {
      Dialog.confirm(Translate('CONFIRM_RETURN_ITEM'), async (r) => {
        if (r) {
          await this.returnItem(item, type);
        }
      }, Translate('CONFIRM'), false, {
        confirmText: Translate('OK'),
        cancelText: Translate('CANCEL'),
        dismissOnTouchOutside: true,
      });
    } else {
      Dialog.confirm(Translate('CONFIRM_RETURN_ITEM'), async (r) => {
        if (r) {
          await this.removeItem(item.id, type);
        }
      }, Translate('CONFIRM'), false, {
        confirmText: Translate('OK'),
        cancelText: Translate('CANCEL'),
        dismissOnTouchOutside: true,
      });
    }
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