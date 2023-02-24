import { combineReducers } from 'redux';

import auth from './auth';
import app from './app';
import network from './network';
import customer from './customer';
import kitchen from './kitchen';
import packaging from './packaging';
import info from './information';
import product from './product';
import transition from './transition';
import report from './report';
import trading from './trading';
import inventory from './inventory';

export const AppReducers = {
  auth,
  app,
  network,
  customer,
  kitchen,
  packaging,
  info,
  product,
  transition,
  report,
  trading,
  inventory,
};

const _reducers = Object.keys(AppReducers).reduce((obj, key) => {
  if (!AppReducers[key]['reducer']) {
    throw new Error('Reducer not found for: ' + key);
  }
  obj[key] = AppReducers[key]['reducer'];
  return obj;
}, {});

export default combineReducers(_reducers);
