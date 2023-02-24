import {
  Alert,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
// import ReactNativeAPK from 'react-native-apk';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import SystemSetting from 'react-native-system-setting';
import HttpService from './HttpService';
import { Store } from '../store';
import fromApp from '../store/app';
import ProductFactory from '../factories/ProductFactory';
import { Translate } from '../components/I18n';
import { PERMISSION } from './PermissionService';
import PermissionService from './PermissionService';
import { LoadingSpinner } from '../components/loadingSpinner';
import { Dialog } from '../components/dialog';

export default class CommonService {

  static getHourAndMinutes(time) {
    const prefix = time.indexOf('h');
    const hour = time.substr(0, prefix);
    const minutes = time.substr(prefix + 1, 2);

    return {
      hour: parseInt(hour),
      minutes: parseInt(minutes),
    };
  }

  static async sendDeviceInfoWhen15() {
    const isSendBatteryInfo = Store.getState().app.get('mustSendBatteryInfo');
    const isConnected = Store.getState().network.get('isConnected');
    const batteryPercent = Store.getState().app.get('batteryPercent');

    if (isConnected) {
      let battery = await DeviceInfo.getBatteryLevel();
      battery = Math.round(battery * 100);
      if (battery <= batteryPercent) {
        if (isSendBatteryInfo) {
          await this.fetchSendInfo();
          // disable send
          Store.dispatch(fromApp.actions.disEnableSendBatteryInfo());
        }
      } else {
        if (!isSendBatteryInfo) {
          Store.dispatch(fromApp.actions.enableSendBatteryInfo());
        }
      }
    }
  }

  static async sendDeviceInfo() {
    const date = new Date();
    const isConnected = Store.getState().network.get('isConnected');
    const schedulers = Store.getState().app.get('scheduleSendBatteryInfo');

    if (isConnected) {
      for (const timer of schedulers) {
        const { hour, minutes } = this.getHourAndMinutes(timer);
        if (date.getHours() === hour && date.getMinutes() === minutes) {
          await this.fetchSendInfo();
        }
      }
    }
  }

  static intervalSendInfo = null;

  static async generateInfo() {
    const device = DeviceInfo.getModel();
    const currentUser = Store.getState().auth.get('currentUser');
    const supermarketId = Store.getState().app.get('selectedMarket');
    const marketList = Store.getState().app.get('marketList');
    let data = {
      user: currentUser,
      device: device + ' (' + (currentUser.fullName || currentUser.username) + ')',
      supermarketId,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      supermarketName: marketList.find(sm => sm.id === supermarketId).name,
    };
    try {
      const battery = await DeviceInfo.getBatteryLevel();
      //get the current brightness
      const brightness = await SystemSetting.getBrightness();
      data = {
        ...data,
        percent: Math.round(battery * 100),
        brightness: Math.round(brightness * 100),
      };
    } catch (e) {
      data = {
        ...data,
        percent: null,
        brightness: null,
      };
    }
    return data;
  }

  static async fetchSendInfo() {
    try {
      const data = await CommonService.generateInfo();
      await HttpService.post('/batterylogs', data, null, {
        disabledToast: true,
      });
    } catch (error) {
      if (__DEV__) {
        console.log('[ERROR] fetchSendInfo', error);
      }
    }
  }

  static runBackgroundSendDeviceInfo() {
    BackgroundTimer.runBackgroundTimer(async () => await this.sendDeviceInfo(),
      60000);
  }

  static clearIntervalSendInfo() {
    if (this.intervalSendInfo !== null) {
      clearInterval(this.intervalSendInfo);
      this.intervalSendInfo = null;
    }
  }

  static resetAppError() {
    const error = Store.getState().app.get('error');
    if (error !== null) {
      Store.dispatch(fromApp.actions.resetError());
    }
  }

  static toEntities(data, key = 'id') {
    let result = {};
    if (data.length > 0) {
      let index = 0;
      for (const item of data) {
        if (item.hasOwnProperty(key)) {
          const id = item[key];
          result[id] = item;
        } else {
          result[index] = item;
          console.warn(`[Warning] Can not found key is ${key} in toEntities()`);
        }
        index++;
      }
    }
    return result;
  }

  static filterEntities(data, length) {
    if (typeof data === 'object' && length) {
      const keys = Object.keys(data);
      if (keys.length > length) {
        const minKey = Math.min(...keys);
        delete data[minKey];
      }
    }
    return data;
  }

  static createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static downloadFile(url, ext = 'jpg') {
    const { fs, config } = RNFetchBlob;
    let DownloadDir = Platform.OS === 'ios' ?
      fs.dirs.DocumentDir :
      fs.dirs.DownloadDir;
    let fileExt = url.substring(url.lastIndexOf('.') + 1);
    if (fileExt.length > 5) {
      fileExt = ext;
    }
    const options = {
      fileCache: true,
      path: DownloadDir + '/me_' +
        Math.floor(new Date().getTime() + new Date().getSeconds() / 2) + '.' +
        fileExt,
    };
    return new Promise((resolve, reject) => {
      config(options).fetch('GET', url).then(res => {
        resolve(res);
      }).catch(err => reject(err));
    });
  }

  static async downloadAPK(url) {
    const permissionStorage = await PermissionService.check('storage');

    if (permissionStorage === PERMISSION.authorized) {
      try {
        LoadingSpinner.show();
        const response = await CommonService.downloadFile(url, 'apk');
        // ReactNativeAPK.installApp(response.data);
        LoadingSpinner.hide();
      } catch (e) {
        LoadingSpinner.hide();
        throw e;
      }
    } else {
      Dialog.alertWarning(Translate('PERMISSION_ACCESS_STORAGE_DENY'));
    }
  };

  static async checkUpdate() {
    try {
      const data = await HttpService.get('/version.json');

      if (data && data.versionName && data.apkUrl && data.forceUpdate) {
        const versionName = DeviceInfo.getVersion();

        let actions = [
          {
            text: Translate('YES'),
            onPress: async () => await this.downloadAPK(data.apkUrl),
          },
        ];

        if (!data.forceUpdate) {
          actions = [
            ...actions, {
              text: Translate('NO'),
              onPress: () => console.log('Cancel Pressed'),
            },
          ];
        }

        if (parseFloat(data.versionName) > parseFloat(versionName)) {
          Alert.alert(Translate('TITLE_UPDATE'),
            Translate('DESCRIPTION_UPDATE'), actions,
            { cancelable: false },
          );
        }
      }
    } catch (e) {
      if (__DEV__) {
        console.log('[ERROR] checkUpdate', e);
      }
    }
  }

  static async fetchVersion() {
    try {
      const currentVersion = Store.getState().app.get('version');
      const version = await HttpService.get(
        `/versionupdates/${currentVersion}`).
        then(response => response.version).
        catch(error => {
          throw  error;
        });

      if (currentVersion !== version) {
        ProductFactory.getProductBarcodeSupermarketLookup();
        Store.dispatch(fromApp.actions.setVersion(version));
      }
    } catch (e) {
      if (__DEV__) {
        console.log('[ERROR] fetchVersion', e);
      }
    }
  }
}
