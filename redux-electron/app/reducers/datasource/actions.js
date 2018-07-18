import { createActions } from 'redux-actions';
import * as types from './types';

const actions = createActions({
  [types.LOAD_DATASOURCE_LIST]: () => undefined,
  [types.LOAD_DATASOURCE_LIST_SUCCESS]: data => ({ data }),
  [types.LOAD_DATASOURCE_ADD]: [
    datasource => ({ datasource }),
    (datasource, callbacks) => ({ callbacks })
  ],
  [types.LOAD_DATASOURCE_ADD_SUCCESS]: data => ({ data }),
  [types.DELETE_DATASOURCE]: [id => ({ id }), (id, callbacks) => ({ callbacks })],
  [types.GET_DATASOURCE_TABLES]: id => ({ id }),
  [types.GET_DATASOURCE_TABLES_SUCCESS]: (dsId, data) => ({ dsId, data }),

  [types.GET_DATASOURCE_TABLES_BY_DS_ID]: id => ({ id }),
  [types.GET_DATASOURCE_TABLES_BY_DS_ID_SUCCESS]: (dsId, data) => ({ dsId, data }),

  [types.GET_DATASOURCE_TABLE_COLUMNS]: [(id, name) => ({ id, name }), (id, name, callbacks) => ({ callbacks })],
  [types.GET_DATASOURCE_TABLE_COLUMNS_SUCCESS]: (name, data) => ({ name, data }),

  [types.GET_DATASOURCE_DYNAMIC_TABLE_COLUMNS]: [(id, name) => ({ id, name }), (id, name, callbacks) => ({ callbacks })],
  [types.GET_DATASOURCE_DYNAMIC_TABLE_COLUMNS_SUCCESS]: (name, data) => ({ name, data }),
});

export default actions;
