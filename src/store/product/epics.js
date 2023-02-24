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

const handleError = (error) => {
  return of({
    type: ActionsType.FETCH_FAILURE,
    payload: error,
  });
};

export const getProducts$ = (action$) => action$.pipe(
  ofType(ActionsType.GET_PRODUCTS),
  switchMap(() => from(ProductFactory.fetchProducts()).
    pipe(
      map((data) => {
          return {
            type: ActionsType.GET_PRODUCTS_SUCCESS,
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