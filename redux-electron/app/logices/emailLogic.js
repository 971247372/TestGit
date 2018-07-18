import { createLogic } from 'redux-logic';
import * as types from '../reducers/email/types';
import actions from '../reducers/email/actions';

const { email: { loadMailSuccess } } = actions;

const sendTestMailLogic = createLogic({
  type: types.SEND_TEST_MAIL,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { data }, meta: { callbacks } } }, dispatch, done) {
    api
      .put('/etl/notification/email/test', { data })
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

const saveMailLogic = createLogic({
  type: types.SAVE_MAIL,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { data }, meta: { callbacks } } }, dispatch, done) {
    api
      .post('/etl/notification/email', { data })
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

const loadMailLogic = createLogic({
  type: types.LOAD_MAIL,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { type = 'email' } } }, dispatch, done) {
    api
      .get(`/etl/notification/${type}`)
      .then(data => {
        dispatch(loadMailSuccess(data));
      })
      .then(() => done());
  }
});

export default [sendTestMailLogic, saveMailLogic, loadMailLogic];
