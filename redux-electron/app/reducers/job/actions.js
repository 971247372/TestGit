import { createActions } from 'redux-actions';
import * as types from './types';

const actions = createActions({
  [types.LOAD_JOB_LIST]: () => undefined,
  [types.LOAD_JOB_LIST_SUCCESS]: data => ({ data }),
  [types.LOAD_JOB_STATUS]: [
    (id, action) => ({ id, action }),
    (id, action, callbacks) => ({ callbacks })
  ],
  [types.LOAD_JOB_STATUS_SUCCESS]: () => undefined,
  [types.LOAD_JOB_CRON]: [(id, cron) => ({ id, cron }), (id, cron, callbacks) => ({ callbacks })],
  [types.LOAD_JOB_CRON_SUCCESS]: () => undefined,
  [types.DELETE_JOB]: [id => ({ id }), (id, callbacks) => ({ callbacks })],
  [types.ADD_JOB]: [job => ({ job }), (job, callbacks) => ({ callbacks })]
});

export default actions;
