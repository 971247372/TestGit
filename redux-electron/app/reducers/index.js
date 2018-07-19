import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import login from './login';

const rootReducer = combineReducers({
  router,
  login
});

export default rootReducer;
