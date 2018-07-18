import { createActions } from 'redux-actions';
import * as types from './types';

const actions = createActions({
  [types.APP_RELOAD]: () => undefined,
  [types.APP_RELOAD_SUCCESS]: () => undefined,
});

export default actions;
