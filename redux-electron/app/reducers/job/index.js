import { handleActions } from 'redux-actions';
import * as types from './types';

export const initState = {
  list: [],
  logList: [],
  logCount: 0,
  loading: true
};

const reducer = handleActions(
  {
    [types.LOAD_JOB_LIST_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      list: data,
      loading: false
    })
  },
  {
    [types.LOAD_JOB_CRON_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      loading: false
    })
  },
  {
    [types.LOAD_JOB_STATUS_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      loading: false
    })
  },
  {
    [types.LOAD_JOB_LOG_LIST_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      logList: data.result,
      logCount: data.count,
      loading: false
    })
  },
  initState
);

export default reducer;
