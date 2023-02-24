import { Store } from '../store';
import fromApp from '../store/app';
import HttpService from '../utils/HttpService';

export default class MarketFactory {

  static async fetchBarcodeFormatBySuperMarketBySystem() {
    try {
      const marketList = Store.getState().app.get('marketList');
      if (marketList.length > 0) {
        const supermarketId = Store.getState().app.get('selectedMarket');
        const currentMarket = marketList.find(m => m.id === supermarketId);

        if (currentMarket) {
          const { system } = currentMarket;
          return await HttpService.get(`/systems/${system.id}`);
        }
        return [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static async fetchSuperMarkets() {
    return await HttpService.get('/supermarkets').
      then(response => response['supermarketList']).catch(error => {
        throw error;
      });
  }

  static async fetchSuperMarket(id) {
    return await HttpService.get(`/supermarkets/${id}`);
  }

  static async getSuperMarkets() {
    try {
      const superMarkets = await this.fetchSuperMarkets();
      Store.dispatch(fromApp.actions.setMarketList(superMarkets));

      const selectedMarketInStore = Store.getState().app.get('selectedMarket');
      const selectedMarketUser = Store.getState().
        auth.
        get('currentUser').supermarketId;

      if (selectedMarketInStore === 0) {
        if (selectedMarketUser !== 0) {
          this.setMarket(selectedMarketUser);
        } else {
          if (superMarkets.length > 0) {
            const firstMarket = superMarkets[0];
            this.setMarket(firstMarket.id);
          }
        }
      }

    } catch (e) {
      console.log('[ERROR] MarketFactory getList', e);
      throw e;
    }
  }

  static setMarket(id) {
    Store.dispatch(fromApp.actions.setMarketId(id));
  }

  static onLogout() {
    try {
      // Store.dispatch(fromApp.actions.setMarketId(0));
    } catch (e) {
      throw new Error(e);
    }
  }
}