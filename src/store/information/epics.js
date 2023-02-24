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

import CommonService from '../../utils/CommonService';
import InfoFactory from '../../factories/InfoFactory';

const handleError = (error) => {
  return of({
    type: ActionsType.FETCH_FAILURE,
    payload: error,
  });
};

export const getOldInformation$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_OLD_INFORMATION),
    switchMap(action => from(InfoFactory.fetchInformation(action.payload)).
        pipe(
            map(response => {
                  const { productSupermarketMobileList, total, note } = response;
                  return {
                    type: ActionsType.GET_OLD_INFORMATION_SUCCESS,
                    payload: {
                      data: CommonService.toEntities(productSupermarketMobileList,
                          'id'),
                      total,
                      note
                    },
                  };

                },
            ),
            catchError((error) => {
              return handleError(error);
            }),
        ),
    ),
);

export const getNewInformation$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_NEW_INFORMATION),
    switchMap(action => from(InfoFactory.fetchInformation(action.payload)).
        pipe(
            map(response => {
                  const { productSupermarketMobileList, total, note } = response;
                  return {
                    type: ActionsType.GET_NEW_INFORMATION_SUCCESS,
                    payload: {
                      data: CommonService.toEntities(productSupermarketMobileList,
                          'id'),
                      total,
                      note
                    },
                  };

                },
            ),
            catchError((error) => {
              return handleError(error);
            }),
        ),
    ),
);

export const getInformation$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_INFORMATION),
    switchMap(action => from(InfoFactory.fetchInformation(action.payload)).
        pipe(
            map(response => {
                  const { productSupermarketMobileList, total, note } = response;
                  return {
                    type: ActionsType.GET_INFORMATION_SUCCESS,
                    payload: {
                      data: CommonService.toEntities(productSupermarketMobileList,
                          'id'),
                      total,
                      note
                    },
                  };

                },
            ),
            catchError((error) => {
              return handleError(error);
            }),
        ),
    ),
);