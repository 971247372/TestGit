import { handleActions } from 'redux-actions';
import * as types from './types';

export const initState = {
  data: {},
};

const reducer = handleActions(
  {
    [types.LOAD_MAIL_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      data
    }),
  },
  initState
);

export default reducer;
