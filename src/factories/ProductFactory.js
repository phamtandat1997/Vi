import moment from 'moment';

import HttpService from '../utils/HttpService';
import { Store } from '../store';
import fromProduct from '../store/product';
import fromApp from '../store/app';
import fromTrading from '../store/trading';

export default class ProductFactory {

  static resetTradingError() {
    const error = Store.getState().trading.get('error');

    if (error !== null) {
      Store.dispatch(fromTrading.actions.resetError());
    }
  }

  static intervalFetchPurchases = null;

  static fetchPurchases() {
    let timeSync = Store.getState().trading.get('timeSync');
    let isRunning = false;
    this.intervalFetchPurchases = setInterval(() => {
      const entities = Store.getState().trading.get('entities');

      if (entities.length > 0 && !isRunning) {
        isRunning = true;
        HttpService.post('/purchases', {
          purchaseEditList: entities,
        }, null, {
          disabledToast: true,
        }).
          then(response => {
            const list = response['inserPurchasetEntityResultList'];
            for (const item of list) {
              if (item.result) {
                Store.dispatch(fromTrading.actions.removeItem(item));
              }
            }
            isRunning = false;
          }).
          catch(error => {
            isRunning = false;
            if (__DEV__) {
              console.log('[ERROR] fetchPurchases', error);
            }
          });
      }
    }, parseFloat(timeSync) * 1000);
  }

  static clearIntervalFetchPurchases() {
    if (this.intervalFetchPurchases !== null) {
      clearInterval(this.intervalFetchPurchases);
      this.intervalFetchPurchases = null;
    }
  }

  static getProducts() {
    Store.dispatch(fromProduct.actions.getProducts());
  }

  static getProductBarcodeSupermarketLookup() {
    Store.dispatch(fromApp.actions.getProductBarcodeSupermarketLookup());
  }

  static async fetchProductBarcodeSupermarketLookup() {
    return await HttpService.get('/productbarcodesupermarketlookups').
      then(data => data.productBarcodeSupermarketLookupList).catch(error => {
        throw error;
      });
  }

  static async fetchProducts() {
    return await HttpService.get('/products').
      then(data => data.productList).
      catch(error => {
        throw error;
      });
  }

  static async fetchMapBarcodeToProduct(data) {
    return HttpService.post('/products/barcode', data);
  }

  static extractProductBarcode(barcode) {
    const barcodeFormat = Store.getState().app.get('barcodeFormat');

    if (barcodeFormat && barcodeFormat.productIdPlaceHolder &&
      barcodeFormat.weightPlaceHolder) {
      try {
        const { productIdPlaceHolder, weightPlaceHolder } = barcodeFormat;
        const product = this.extractPlaceHolder(barcode, productIdPlaceHolder);
        const weight = this.extractPlaceHolder(barcode, weightPlaceHolder);

        return {
          productCode: product,
          weight: parseFloat(weight) / 1000,
        };
      } catch (error) {
        if (__DEV__) {
          console.log('[ERROR] extractProductBarcode', error);
        }
        return {
          productCode: null,
          weight: null,
        };
      }
    }
    return {
      productCode: null,
      weight: null,
    };
  }

  static extractPlaceHolder(barcode, placeHolder) {
    const n = placeHolder.search(/,/i);
    const width = placeHolder.substr(0, n);
    const to = placeHolder.substr(n + 1, placeHolder.length);

    return barcode.substr(width, to);
  }

  static getProductByBarcode(barcode) {
    const productBarcode = Store.getState().app.get('productIdFromBarcode');
    const supermarketId = Store.getState().app.get('selectedMarket');
    const { productCode, weight } = this.extractProductBarcode(barcode);
    const data = Object.values(productBarcode).
      find(item => item.supermarketId === supermarketId &&
        item.productIdFromBarcode === productCode);

    if (data && productCode !== null && weight !== null) {
      return {
        ...data,
        weight,
      };
    }
    return undefined;
  }

  static generateSaleOrReturnProduct(barcode, isSale?) {
    const product = this.getProductByBarcode(barcode);

    if (product) {
      const { productName, weight } = product;
      let barcodeObj = {
        id: new Date().getTime(),
        date: moment().format('HH:mm:ss'),
        name: '',
        weight: 0,
        barcode,
        status: isSale,
      };
      return {
        ...barcodeObj,
        name: productName,
        weight,
      };
    }
    return undefined;
  }
}