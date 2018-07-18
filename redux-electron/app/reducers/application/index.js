import { handleActions } from 'redux-actions';
import * as types from './types';

export const initState = {
  loading: false
};

const reducer = handleActions(
  {
    [types.APP_RELOAD]: state => ({
      ...state,
      loading: true
    }),
    [types.APP_RELOAD_SUCCESS]: state => ({
      ...state,
      loading: false
    })
  },
  initState
);

export default reducer;
