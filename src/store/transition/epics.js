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
import TransitionFactory from '../../factories/TransitionFactory';

const handleError = (error) => {
  return of({
    type: ActionsType.FETCH_FAILURE,
    payload: error,
  });
};

export const getOldTransition$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_OLD_TRANSITION),
    switchMap(action => from(TransitionFactory.fetchTransfers(action.payload)).
        pipe(
            map(response => {
                  const { transfers, total } = response;
                  return {
                    type: ActionsType.GET_OLD_TRANSITION_SUCCESS,
                    payload: {
                      data: CommonService.toEntities(transfers, 'id'),
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

export const getNewTransition$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_NEW_TRANSITION),
    switchMap(action => from(TransitionFactory.fetchTransfers(action.payload)).
        pipe(
            map(response => {
                  const { transfers, total } = response;
                  return {
                    type: ActionsType.GET_NEW_TRANSITION_SUCCESS,
                    payload: {
                      data: CommonService.toEntities(transfers, 'id'),
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

export const getTransition$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_TRANSITION),
    switchMap(
        (action) => from(TransitionFactory.fetchTransfers(action.payload)).
            pipe(
                map(response => {
                      const { transfers, total } = response;
                      return {
                        type: ActionsType.GET_TRANSITION_SUCCESS,
                        payload: {
                          data: CommonService.toEntities(transfers, 'id'),
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

export const getTransitionDetail$ = (action$) => action$.pipe(
    ofType(ActionsType.GET_TRANSITION_DETAIL),
    switchMap(
        (action) => from(
            TransitionFactory.fetchTransfersDetail(action.payload)).
            pipe(
                map(response => {
                      return {
                        type: ActionsType.GET_TRANSITION_DETAIL_SUCCESS,
                        payload: response,
                      };
                    },
                ),
                catchError((error) => {
                  return handleError(error);
                }),
            ),
    ),
);