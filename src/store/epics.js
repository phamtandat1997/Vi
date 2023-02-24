import {
  combineEpics,
  createEpicMiddleware,
} from 'redux-observable';

import {
  login$,
  loginSuccess$,
} from './auth/epics';
import { getProducts$ } from './product/epics';
import {
  getTransition$,
  getTransitionDetail$,
  getNewTransition$,
  getOldTransition$,
} from './transition/epics';
import {
  getInformation$,
  getNewInformation$,
  getOldInformation$,
} from './information/epics';
import {
  getNewReport$,
  getOldReport$,
  getReport$,
} from './report/epics';
import {
  getBarcodeFormatBySuperMarketSystem$,
  getProductBarcodeSupermarketLookup$,
  setSuperMarketDetail$,
} from './app/epics';
import {
  getInventories$,
  getNewInventories$,
  getOldInventories$,
} from './inventory/epics';

export const rootEpic = combineEpics(
  login$,
  loginSuccess$,
  getProducts$,
  getTransition$,
  getTransitionDetail$,
  getNewTransition$,
  getOldTransition$,
  getInformation$,
  getNewInformation$,
  getOldInformation$,
  getReport$,
  getNewReport$,
  getOldReport$,
  getProductBarcodeSupermarketLookup$,
  setSuperMarketDetail$,
  getBarcodeFormatBySuperMarketSystem$,
  getInventories$,
  getOldInventories$,
  getNewInventories$,
);

const epicMiddleware = createEpicMiddleware();

export default epicMiddleware;
