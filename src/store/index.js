import {
  createStore,
  applyMiddleware,
} from 'redux';
import {
  persistStore,
} from 'redux-persist';
import { logger } from 'redux-logger';

import PersistReducer from './persistReducer';

import EpicMiddleware, { rootEpic } from './epics';

const logs = [];
if (__DEV__) {
  logs.push(logger);
}

export const Store = createStore(PersistReducer,
    applyMiddleware(...logs, EpicMiddleware));

EpicMiddleware.run(rootEpic);

export const PersisStore = persistStore(Store);
