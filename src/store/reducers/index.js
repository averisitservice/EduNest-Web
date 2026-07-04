import { combineReducers } from 'redux';

import appReducer from './appReducer';
import authReducer from './authReducer';
import snackbar from './snackbar';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  snackbar,
  AuthReducer: authReducer.reducer,
  AppReducer: appReducer.reducer,
});

export default reducers;
