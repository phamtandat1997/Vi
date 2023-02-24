import { Store } from '../../store';
import { actions as ActionsType } from './actions';
import { ofType } from 'redux-observable';
import {
  switchMap,
  map,
  catchError,
  tap,
} from 'rxjs/operators';
import {
  from,
  of,
} from 'rxjs';

import AuthenticationFactory from '../../factories/AuthenticationFactory';
import Navigation from '../../utils/NavigationService';
import MarketFactory from '../../factories/MarketFactory';
import ProductFactory from '../../factories/ProductFactory';
import CommonService from '../../utils/CommonService';

const handleError = (error) => {
  return of({
    type: ActionsType.FETCH_FAILURE,
    payload: { error },
  });
};

const handleLoginFail = (error) => {
  return of({
    type: ActionsType.LOGIN_FAILURE,
    payload: { error },
  });
};

export const loginSuccess$ = (action$) => action$.pipe(
  ofType(ActionsType.LOGIN_SUCCESSFUL),
  switchMap(
    (action) => from(AuthenticationFactory.fetchUserInfo(action.payload)).
      pipe(
        tap(async () => {
          ProductFactory.getProducts();
          CommonService.fetchVersion();
          await MarketFactory.getSuperMarkets();

          if (!Store.getState().app.get('selectedMarket')) {
            Navigation.navigate('SelectSupermarket');
          } else {
            Navigation.navigate('Home');
          }
        }),
        map((response) => {
            return {
              type: ActionsType.SET_CURRENT_USER,
              payload: response,
            };
          },
        ),
        catchError((error) => handleError(error)),
      ),
  ),
);

export const login$ = (action$) => action$.pipe(
  ofType(ActionsType.LOGIN),
  switchMap(
    action => from(AuthenticationFactory.fetchLogin(action.payload)).
      pipe(
        map((response) => {
            if (response && response['access_token']) {
              return {
                type: ActionsType.LOGIN_SUCCESSFUL,
                payload: {
                  ...response,
                  ...action.payload,
                },
              };
            }
            return {
              type: null,
            };
          },
        ),
        catchError((error) => {
          return handleLoginFail(error);
        }),
      ),
  ),
);