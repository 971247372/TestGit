import { createLogic } from 'redux-logic';
import * as types from '../reducers/job/types';
import actions from '../reducers/job/actions';

const { job: { loadJobListSuccess, loadJobStatusSuccess, loadJobCronSuccess } } = actions;

const loadJobListLogic = createLogic({
  type: types.LOAD_JOB_LIST,
  process({ api }, dispatch, done) {
    api
      .get('/job/list')
      .then(data => dispatch(loadJobListSuccess(data)))
      .then(() => done());
  }
});
const loadJobStatusLogic = createLogic({
  type: types.LOAD_JOB_STATUS,
  process({ api, action: { payload: { id, action }, meta: { callbacks } } }, dispatch, done) {
    api
      .put('/job/switch/' + id, { params: { action } })
      .then(() => {
        if (callbacks.success) {
          callbacks.success();
        }
      })
      .catch(err => {
        if (callbacks.fail) {
          callbacks.fail(err);
        }
      })
      .then(() => done());
  }
});
const loadJobCronLogic = createLogic({
  type: types.LOAD_JOB_CRON,
  process({ api, action: { payload: { id, cron }, meta: { callbacks } } }, dispatch, done) {
    api
      .put('/job/' + id, { params: { cron } })
      .then(() => {
        if (callbacks.success) {
          callbacks.success();
        }
      }, (err) => {
        if (callbacks.fail) {
          callbacks.fail(err);
        }
      }).then(() => done());
  }
});

const deleteJobLogic = createLogic({
  type: types.DELETE_JOB,
  process({ api, action: { payload: { id }, meta: { callbacks } } }, dispatch, done) {
    api
      .delete('/job/' + id)
      .then(() => {
        if (callbacks.success) {
          callbacks.success();
        }
      })
      .catch(err => {
        if (callbacks.fail) {
          callbacks.fail(err);
        }
      })
      .then(() => done());
  }
});

const addJobLogic = createLogic({
  type: types.ADD_JOB,
  process({ api, action: { payload: { job }, meta: { callbacks } } }, dispatch, done) {
    api
      .post('job/', { data: job })
      .then(() => {
        if (callbacks.success) {
          callbacks.success();
        }
      })
      .catch(err => {
        if (callbacks.fail) {
          callbacks.fail(err);
        }
      })
      .then(() => done());
  }
});

export default [
  loadJobListLogic,
  loadJobStatusLogic,
  loadJobCronLogic,
  deleteJobLogic,
  addJobLogic
];
