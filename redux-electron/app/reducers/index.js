import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import datasource from './datasource';
import application from './application';
import job from './job';
import etl from './etl';
import log from './log';
import email from './email';
import login from './login';

const rootReducer = combineReducers({
  datasource,
  router,
  application,
  job,
  etl,
  log,
  email,
  login
});

export default rootReducer;
