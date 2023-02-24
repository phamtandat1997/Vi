import { actions as ActionsType } from './actions';
import { ofType } from 'redux-observable';
import {
  switchMap,
  map,
  catchError,
} from 'rxjs/operators';
import {
  from,
  of,
} from 'rxjs';

import ProductFactory from '../../factories/ProductFactory';
import CommonService from '../../utils/CommonService';
import MarketFactory from '../../factories/MarketFactory';

const handleError = (error) => {
  return of({
    type: ActionsType.FETCH_FAILURE,
    payload: error,
  });
};

export const getBarcodeFormatBySuperMarketSystem$ = (action$) => action$.pipe(
  ofType(ActionsType.GET_BARCODE_FORMAT_BY_SUPER_MARKET_SYSTEM),
  switchMap(() => from(MarketFactory.fetchBarcodeFormatBySuperMarketBySystem()).
    pipe(
      map((data) => {
          const barcodeFormat = data.barcodeFormats.length > 0 ?
            data.barcodeFormats[0] : [];

          return {
            type: ActionsType.SET_BARCODE_FORMAT_BY_SUPER_MARKET,
            payload: barcodeFormat,
          };
        },
      ),
      catchError((error) => {
        return handleError(error);
      }),
    ),
  ),
);

export const setSuperMarketDetail$ = (action$) => action$.pipe(
  ofType(ActionsType.SET_MARKET_ID),
  switchMap((action) => from(MarketFactory.fetchSuperMarket(action.id)).
    pipe(
      map((data) => {
          const barcodeFormat = data.barcodeFormats.length > 0 ?
            data.barcodeFormats[0] : [];

          if (barcodeFormat.length === 0) {
            return {
              type: ActionsType.GET_BARCODE_FORMAT_BY_SUPER_MARKET_SYSTEM,
            };
          }

          return {
            type: ActionsType.SET_BARCODE_FORMAT_BY_SUPER_MARKET,
            payload: barcodeFormat,
          };
        },
      ),
      catchError((error) => {
        return handleError(error);
      }),
    ),
  ),
);

export const getProductBarcodeSupermarketLookup$ = (action$) => action$.pipe(
  ofType(ActionsType.GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP),
  switchMap(() => from(ProductFactory.fetchProductBarcodeSupermarketLookup()).
    pipe(
      map((data) => {
          return {
            type: ActionsType.GET_PRODUCT_BARCODE_SUPER_MARKET_LOOKUP_SUCCESS,
            payload: CommonService.toEntities(data, 'id'),
          };
        },
      ),
      catchError((error) => {
        return handleError(error);
      }),
    ),
  ),
);