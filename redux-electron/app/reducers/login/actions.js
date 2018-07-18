import { createActions } from 'redux-actions';
import * as types from './types';

const actions = createActions({
  [types.CHECK_LOGIN]: logined => ({ logined })
});

export default actions;
