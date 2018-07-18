import { createLogic } from 'redux-logic';
import * as types from '../reducers/application/types';
import actions from '../reducers/application/actions';

const { application: { appReloadSuccess } } = actions;

const appReloadLogic = createLogic({
  type: types.APP_RELOAD,
  process({ api }, dispatch, done) {
    api
      .delete('/etl/cache')
      .then(() => dispatch(appReloadSuccess()))
      .then(() => done());
  }
});

export default [appReloadLogic];
