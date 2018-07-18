import { handleActions } from 'redux-actions';
import * as types from './types';

export const initState = {
  logList: [],
  list: [],
  total: 0,
  logCount: 0,
  loading: true
};

const reducer = handleActions(
  {
    [types.LOAD_JOB_LOG_LIST_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      logList: data.result,
      logCount: data.count,
      loading: false
    }),

    [types.LOAD_LOG_LIST_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      list: data.jobScheduledLogDtos,
      total: data.count,
      loading: false
    }),
  },
  initState
);

export default reducer;
