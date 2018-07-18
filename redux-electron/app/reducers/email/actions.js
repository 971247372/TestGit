import { createActions } from 'redux-actions';
import * as types from './types';

const actions = createActions({
  [types.SEND_TEST_MAIL]: [data => ({ data }), (data, callbacks) => ({ callbacks })],
  [types.SAVE_MAIL]: [data => ({ data }), (data, callbacks) => ({ callbacks })],
  [types.LOAD_MAIL]: type => ({ type }),
  [types.LOAD_MAIL_SUCCESS]: data => ({ data }),
});

export default actions;
