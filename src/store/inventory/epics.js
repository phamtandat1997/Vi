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
import InventoryFactory from '../../factories/InventoryFactory';

const handleError = (error) => {
  return of({
    type: ActionsType.FETCH_FAILURE,
    payload: error,
  });
};

export const getOldInventories$ = (action$) => action$.pipe(
  ofType(ActionsType.GET_OLD_INVENTORIES),
  switchMap(action => from(InventoryFactory.fetchInventories(action.payload)).
    pipe(
      map(response => {
          const { InventoryList, total } = response;
          return {
            type: ActionsType.GET_OLD_INVENTORIES_SUCCESS,
            payload: {
              data: CommonService.toEntities(InventoryList, 'Id'),
              total,
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

export const getNewInventories$ = (action$) => action$.pipe(
  ofType(ActionsType.GET_NEW_INVENTORIES),
  switchMap(action => from(InventoryFactory.fetchInventories(action.payload)).
    pipe(
      map(response => {
          const { InventoryList, total } = response;
          return {
            type: ActionsType.GET_NEW_INVENTORIES_SUCCESS,
            payload: {
              data: CommonService.toEntities(InventoryList, 'Id'),
              total,
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

export const getInventories$ = (action$) => action$.pipe(
  ofType(ActionsType.GET_INVENTORIES),
  switchMap(
    (action) => from(InventoryFactory.fetchInventories(action.payload)).
      pipe(
        map(response => {
            const { InventoryList, total } = response;
            return {
              type: ActionsType.GET_INVENTORIES_SUCCESS,
              payload: {
                data: CommonService.toEntities(InventoryList, 'Id'),
                total,
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