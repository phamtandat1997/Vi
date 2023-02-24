import { persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import rootReducer from './reducers';
import FilesystemStorage from 'redux-persist-filesystem-storage';

const config = {
  key: 'root',
  // storage: storage,
  storage: FilesystemStorage,
  // states have been save in AsyncStorage
  whitelist: ['auth', 'app', 'trading'],
  transforms: [immutableTransform()],
};

const PersistReducer = persistReducer(config, rootReducer);
export default PersistReducer;

