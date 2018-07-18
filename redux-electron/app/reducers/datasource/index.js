import { handleActions } from 'redux-actions';
import * as types from './types';

export const initState = {
  list: [],
  loading: true,
  tables: {},
  columns: {},
  dynamicTable: {},
  dsLoading: true,
  columnLoading: true,
};

const reducer = handleActions(
  {
    [types.LOAD_DATASOURCE_ADD_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      id: data,
      loading: false
    }),
    [types.LOAD_DATASOURCE_DELETE_SUCCESS]: state => ({
      ...state,
      loading: false
    }),
    [types.LOAD_DATASOURCE_LIST_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      list: data,
      loading: false
    }),
    [types.GET_DATASOURCE_TABLES]: state => ({
      ...state,
      dsLoading: true
    }),
    [types.GET_DATASOURCE_TABLES_SUCCESS]: (state, { payload: { dsId, data } }) => ({
      ...state,
      tables: {
        ...state.tables,
        [dsId]: data
      },
      dsLoading: false
    }),
    [types.GET_DATASOURCE_TABLES_BY_DS_ID]: state => ({
      ...state,
      dsLoading: true
    }),
    [types.GET_DATASOURCE_TABLES_BY_DS_ID_SUCCESS]: (state, { payload: { dsId, data } }) => ({
      ...state,
      tables: {
        ...state.tables,
        [dsId]: data
      },
      dsLoading: false
    }),

    [types.GET_DATASOURCE_TABLE_COLUMNS]: state => ({
      ...state,
      columnLoading: true
    }),
    [types.GET_DATASOURCE_TABLE_COLUMNS_SUCCESS]: (state, { payload: { name, data } }) => ({
      ...state,
      columns: {
        ...state.columns,
        [name]: data.columns
      },
      columnLoading: false
    }),
    [types.GET_DATASOURCE_DYNAMIC_TABLE_COLUMNS_SUCCESS]: (state, { payload: { name, data } }) => {
      const { columns, ...dynamicTable } = data;
      return {
        ...state,
        columns: {
          ...state.columns,
          [name]: columns
        },
        dynamicTable,
        columnLoading: false
      };
    },
  },
  initState
);

export default reducer;
