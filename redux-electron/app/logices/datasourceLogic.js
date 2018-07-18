import { createLogic } from 'redux-logic';
import * as types from '../reducers/datasource/types';
import actions from '../reducers/datasource/actions';

const {
  datasource: {
    loadDatasourceListSuccess,
    loadDatasourceAddSuccess,
    getDatasourceTablesSuccess,
    getDatasourceTablesByDsIdSuccess,
    getDatasourceTableColumnsSuccess,
    getDatasourceDynamicTableColumnsSuccess
  }
} = actions;

const loadDatasourceListLogic = createLogic({
  type: types.LOAD_DATASOURCE_LIST,
  process({ api }, dispatch, done) {
    api
      .get('/etl/ds')
      .then(data => dispatch(loadDatasourceListSuccess(data)))
      .then(() => done());
  }
});
const loadDatasourceAddLogic = createLogic({
  type: types.LOAD_DATASOURCE_ADD,
  process({ api, action: { payload: { datasource }, meta: { callbacks } } }, dispatch, done) {
    api
      .post('/etl/ds', { data: datasource })
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
const loadDatasourceDeleteLogic = createLogic({
  type: types.DELETE_DATASOURCE,
  process({ api, action: { payload: { id }, meta: { callbacks } } }, dispatch, done) {
    api
      .delete('/etl/ds', { params: { id } })
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
const getDatasourceTablesLogic = createLogic({
  type: types.GET_DATASOURCE_TABLES,
  process({ api, action: { payload: { id } } }, dispatch, done) {
    api
      .post(`/etl/${id}/tables`)
      .then(data => dispatch(getDatasourceTablesSuccess(id, data)))
      .then(() => done());
  }
});

const getDatasourceTablesByIdLogic = createLogic({
  type: types.GET_DATASOURCE_TABLES_BY_DS_ID,
  warnTimeout: 0,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id } } }, dispatch, done) {
    api
      .get(`/etl/ds/${id}/table/list`)
      .then(data => dispatch(getDatasourceTablesByDsIdSuccess(id, data)))
      .catch(err => {
        // if (callbacks.fail) {
        //   callbacks.fail(err);
        // }
      })
      .then(() => done());
  }
});

const getDatasourceTableColumnsLogic = createLogic({
  type: types.GET_DATASOURCE_TABLE_COLUMNS,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id, name }, meta: { callbacks } } }, dispatch, done) {
    api
      .post(`/etl/ds/${id}/column`, { params: { name } })
      .then(data => {
        if (callbacks.success) {
          callbacks.success(data);
        }
        dispatch(getDatasourceTableColumnsSuccess(name, data));
      })
      .catch(err => {
        if (callbacks.fail) {
          callbacks.fail(err);
        }
      })
      .then(() => done());
  }
});

const getDatasourceDynamicTableColumnsLogic = createLogic({
  type: types.GET_DATASOURCE_DYNAMIC_TABLE_COLUMNS,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id, name }, meta: { callbacks } } }, dispatch, done) {
    api
      .get(`/etl/ds/${id}/dynamic-table/${name}/column`)
      .then(data => {
        dispatch(getDatasourceDynamicTableColumnsSuccess(name, data));
        return data;
      })
      .then(data => {
        if (callbacks.success) {
          callbacks.success(data);
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
  loadDatasourceListLogic,
  loadDatasourceAddLogic,
  loadDatasourceDeleteLogic,
  getDatasourceTablesLogic,
  getDatasourceTablesByIdLogic,
  getDatasourceTableColumnsLogic,
  getDatasourceDynamicTableColumnsLogic
];
