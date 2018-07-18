import { createActions } from 'redux-actions';
import * as types from './types';

const actions = createActions({
  [types.LOAD_JOB_LOG_LIST]: (taskId, page, rows) => ({ taskId, page, rows }),
  [types.LOAD_JOB_LOG_LIST_SUCCESS]: data => ({ data }),
  
  [types.LOAD_LOG_LIST]: (page, rows, condition) => ({ page, rows, condition }),
  [types.LOAD_LOG_LIST_SUCCESS]: data => ({ data }),
});

export default actions;
