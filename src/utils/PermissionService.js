import Permissions from 'react-native-permissions';

export const PERMISSION = {
  authorized: 'authorized',
  denied: 'denied',
  restricted: 'restricted',
  undetermined: 'undetermined',
};

export default class PermissionService {

  static async check(type) {
    try {
      return await Permissions.check(type, { type: 'always' });
    } catch (e) {
      console.log('[ERROR CHECK PERMISSION]', e);
      return undefined;
    }
  }

  static async request(type, option?) {
    try {
      return Permissions.request(type, option);
    } catch (e) {
      console.log('[ERROR REQUEST PERMISSION]', e);
      return undefined;
    }
  }
}