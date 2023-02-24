import HttpService from '../utils/HttpService';
import { LoadingSpinner } from '../components/loadingSpinner';
import { Dialog } from '../components/dialog';
import { Store } from '../store';
import fromTransition from '../store/transition';
import NavigationService from '../utils/NavigationService'

export default class TransitionFactory {

  static async transfers(data) {
    try {
      LoadingSpinner.show();
      await HttpService.post('/transfers', data);
      LoadingSpinner.hide();
    } catch (error) {
      if (__DEV__) {
        console.log('[ERROR] transfers', error);
      }
      LoadingSpinner.hide();
      setTimeout(() => {
        Dialog.alertError('Không thể tạo đơn điều chuyển. Vui lòng thử lại sau',
            'Lỗi');
      }, 300);
    }
  }

  static async fetchTransfers(queryParam) {
    return HttpService.get('/transfers', queryParam);
  }

  static async fetchTransfersDetail(id) {
    return HttpService.get(`/transfers/${id}`);
  }

  static getTransition(data) {
    Store.dispatch(fromTransition.actions.getTransition(data));
  }

  static getNewTransition(data) {
    Store.dispatch(fromTransition.actions.getNewTransition(data));
  }

  static getOldTransition(data) {
    Store.dispatch(fromTransition.actions.getOldTransition(data));
  }

  static getTransitionDetail(data) {
    Store.dispatch(fromTransition.actions.getTransitionDetail(data));
  }

  static markReceived(id) {
    Store.dispatch(fromTransition.actions.markReceived(id));
  }

  static async acceptTransfer(data) {
    try {
      LoadingSpinner.show();
      await HttpService.put(`/transfers/${data.id}/Received`, { id: data.id });
      this.markReceived(data.id);
      LoadingSpinner.hide();
      setTimeout(() => NavigationService.goBack(), 500);
    } catch (e) {
      LoadingSpinner.hide();
      setTimeout(() => {
        Dialog.alertError(
            'Không thể xác nhận thông tin chuyển hàng. Vui lòng thử lại sau',
            'Lỗi');
      }, 300);
    }
  }
}