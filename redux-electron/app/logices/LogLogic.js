import { createLogic } from 'redux-logic';
import * as types from '../reducers/log/types';
import actions from '../reducers/log/actions';

const { log: { loadJobLogListSuccess, loadLogListSuccess } } = actions;

const loadJobLogListLogic = createLogic({
  type: types.LOAD_JOB_LOG_LIST,
  process({ api, action: { payload: { taskId, page, rows } } }, dispatch, done) {
    api
      .get('/etl/logs', { params: { taskId, page, rows } })
      .then(data => dispatch(loadJobLogListSuccess(data)))
      .then(() => done());
  }
});

const loadLogListLogic = createLogic({
  type: types.LOAD_LOG_LIST,
  process({ api, action: { payload: { page, rows, condition } } }, dispatch, done) {
    api
      .get('/job/logs', { params: { page, rows, ...condition } })
      .then(data => dispatch(loadLogListSuccess(data)))
      .then(() => done());
  }
});

export default [loadJobLogListLogic, loadLogListLogic];
