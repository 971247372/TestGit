import { createActions } from 'redux-actions';
import * as types from './types';

const actions = createActions({
  [types.LOAD_ETL_LIST]: (page = 1, rows = 10) => ({ page, rows }),
  [types.LOAD_ETL_LIST_SUCCESS]: data => ({ data }),
  [types.LOAD_ETL_LIST_ALL]: () => undefined,
  [types.LOAD_ETL_LIST_ALL_SUCCESS]: data => ({ data }),
  [types.LOAD_ETL]: [id => ({ id }), (id, callbacks) => ({ callbacks })],
  [types.DELETE_ETL]: [id => ({ id }), (id, callbacks) => ({ callbacks })],

  [types.ADD_MAPPER]: (id, mapper) => ({ id, mapper }),
  [types.UPDATE_MAPPER]: mapper => ({ mapper }),
  [types.SAVE_MAPPER]: [id => ({ id }), (id, callbacks) => ({ callbacks })],
  [types.SAVE_PutMAPPER]: [id => ({ id }), (id, callbacks) => ({ callbacks })],
  [types.SAVE_MAPPER_PROP]: (id, type, data) => ({ id, type, data }),
  [types.ADD_MAPPER_ENTITY]: mapper => ({ mapper }),

  [types.UPDATE_DYNAMIC_TABLE]: [(id, name, nameNew, sql) => ({ id, name, nameNew, sql }), (id, name, sql, nameNew, callbacks) => ({ callbacks })],
  [types.DELETE_DYNAMIC_TABLE]: [(id, name) => ({ id, name }), (id, name, callbacks) => ({ callbacks })],
  [types.DYNAMIC_TABLE]: [(id, name, sql) => ({ id, name, sql }), (id, name, sql, callbacks) => ({ id, sql, callbacks })],
  [types.DYNAMIC_TABLE_PREVIEW]: [(id, sql) => ({ id, sql }), (id, sql, callbacks) => ({ id, sql, callbacks })],
  [types.FIELD_MAPPING]: [(id, sourceFieldType, sourceDataSize, targetDsId) => ({ id, sourceFieldType, sourceDataSize, targetDsId }), (id, sourceFieldType, sourceDataSize, targetDsId, callbacks) => ({ callbacks })],
  [types.FIELD_MAPPING_ALL]: [(id, targetDsId, data) => ({ id, targetDsId, data }), (id, targetDsId, data, callbacks) => ({ callbacks })],
  [types.FIELD_LIST]: [sourceDbType => ({ sourceDbType }), (sourceDbType, callbacks) => ({ callbacks })],
  [types.AUTO_TARGET]: [(id, data) => ({ id, data }), (id, data, callbacks) => ({ id, data, callbacks })],

  [types.DO_SELECT]: current => ({ current })
});

export default actions;
