import { handleActions } from 'redux-actions';
import * as types from './types';

export const initState = {
  logined: false
};

const reducer = handleActions(
  {
    [types.CHECK_LOGIN]: (state, { payload: { logined } }) => ({
      ...state,
      logined
    })
  },
  initState
);

export default reducer;
