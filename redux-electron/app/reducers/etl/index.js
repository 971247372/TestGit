import { handleActions } from 'redux-actions';
import * as types from './types';

export const initState = {
  list: [],
  allList: [],
  loading: true,
  total: 0,
  mapper: {},
  current: {},
  fields: [],
  mapperLoading: true
};

const reducer = handleActions(
  {
    [types.LOAD_ETL_LIST_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      list: data.mapper,
      total: data.count,
      loading: false
    }),
    [types.LOAD_ETL_LIST_ALL_SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      allList: data
    }),

    [types.LOAD_ETL]: state => ({
      ...state,
      mapperLoading: true
    }),

    [types.ADD_MAPPER_ENTITY]: (state, { payload: { mapper } }) => ({
      ...state,
      mapper: {
        ...state.mapper,
        ...mapper
      },
      current: {
        ...state.current,
        mapperId: Object.keys(mapper)[0]
      },
      mapperLoading: false
    }),

    [types.DO_SELECT]: (state, { payload: { current } }) => ({
      ...state,
      current: {
        ...state.current,
        ...current
      }
    })
  },
  initState
);

export default reducer;
