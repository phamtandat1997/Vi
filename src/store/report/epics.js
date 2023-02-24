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
import ReportFactory from '../../factories/ReportFactory';

const handleError = (error) => {
  return of({
    type: ActionsType.FETCH_FAILURE,
    payload: error,
  });
};

export const getOldReport$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_OLD_REPORT),
    switchMap(action => from(ReportFactory.fetchReport(action.payload)).
        pipe(
            map(response => {
                  const { purchaseList, total } = response;
                  return {
                    type: ActionsType.GET_OLD_REPORT_SUCCESS,
                    payload: {
                      data: CommonService.toEntities(purchaseList, 'id'),
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

export const getNewReport$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_NEW_REPORT),
    switchMap(action => from(ReportFactory.fetchReport(action.payload)).
        pipe(
            map(response => {
                  const { purchaseList, total } = response;
                  return {
                    type: ActionsType.GET_NEW_REPORT_SUCCESS,
                    payload: {
                      data: CommonService.toEntities(purchaseList, 'id'),
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

export const getReport$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_REPORT),
    switchMap(
        (action) => from(ReportFactory.fetchReport(action.payload)).
            pipe(
                map(response => {
                      const { purchaseList, total } = response;
                      return {
                        type: ActionsType.GET_REPORT_SUCCESS,
                        payload: {
                          data: CommonService.toEntities(purchaseList, 'id'),
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