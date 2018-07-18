import { createLogic } from 'redux-logic';
import * as types from '../reducers/etl/types';
import actions from '../reducers/etl/actions';
import dsActions from '../reducers/datasource/actions';

const { etl: { loadEtlListSuccess, loadEtlListAllSuccess, addMapper } } = actions;
const { datasource: { getDatasourceTablesByDsId } } = dsActions;

const loadEtlListLogic = createLogic({
  type: types.LOAD_ETL_LIST,
  process({ api, action: { payload: { page, rows } } }, dispatch, done) {
    api
      .get('/etl/table-mapper', { params: { page, rows } })
      .then(data => dispatch(loadEtlListSuccess(data)))
      .then(() => done());
  }
});

const loadEtlListAllLogic = createLogic({
  type: types.LOAD_ETL_LIST_ALL,
  process({ api }, dispatch, done) {
    api
      .get('/etl/table-mapper/all')
      .then(data => dispatch(loadEtlListAllSuccess(data)))
      .then(() => done());
  }
});

const loadEtlLogic = createLogic({
  type: types.LOAD_ETL,
  latest: true, // take latest only
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id }, meta: { callbacks } } }, dispatch, done) {
    api
      .get(`/etl/table-mapper/${id}`)
      .then(data => {
        const layout = JSON.parse(data.layout);
        layout.mapper.options.sourceDataIdentificationValue = data.sourceDataIdentificationValue;
        dispatch(addMapper(layout.id, layout.mapper));
      })
      .then(() => done());
  }
});

const deleteEtlLogic = createLogic({
  type: types.DELETE_ETL,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id }, meta: { callbacks } } }, dispatch, done) {
    api
      .delete(`/etl/table-mapper/${id}`)
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

const dynamicTablePreviewLogic = createLogic({
  type: types.DYNAMIC_TABLE_PREVIEW,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id, sql }, meta: { callbacks } } }, dispatch, done) {
    api
      .post(`/etl/ds/${id}/dynamic-table/data`, {
        data: { sqlText: sql },
        params: { start: 0, rows: 10 }
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

const updateDynamicTableLogic = createLogic({
  type: types.UPDATE_DYNAMIC_TABLE,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process(
    { api, action: { payload: { id, name, nameNew, sql }, meta: { callbacks } } },
    dispatch,
    done
  ) {
    api
      .put(`/etl/ds/${id}/dynamic-table`, { data: { sqlText: sql }, params: { name, nameNew } })
      .then(data => {
        if (callbacks.success) {
          dispatch(getDatasourceTablesByDsId(id));
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

const deleteDynamicTableLogic = createLogic({
  type: types.DELETE_DYNAMIC_TABLE,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id, name }, meta: { callbacks } } }, dispatch, done) {
    api
      .delete(`/etl/ds/${id}/dynamic-table`, { params: { name } })
      .then(data => {
        if (callbacks.success) {
          dispatch(getDatasourceTablesByDsId(id));
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

const dynamicTableLogic = createLogic({
  type: types.DYNAMIC_TABLE,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id, name, sql }, meta: { callbacks } } }, dispatch, done) {
    api
      .post(`/etl/ds/${id}/dynamic-table`, { data: { sqlText: sql }, params: { name } })
      .then(data => {
        if (callbacks.success) {
          dispatch(getDatasourceTablesByDsId(id));
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

const fieldMappingLogic = createLogic({
  type: types.FIELD_MAPPING,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process(
    {
      api,
      action: { payload: { id, sourceFieldType, sourceDataSize, targetDsId }, meta: { callbacks } }
    },
    dispatch,
    done
  ) {
    api
      .get(`/etl/ds/${id}/field-type/maping`, {
        params: { id, sourceFieldType, sourceDataSize, targetDsId }
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

const fieldMappingAllLogic = createLogic({
  type: types.FIELD_MAPPING_ALL,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process(
    { api, action: { payload: { id, targetDsId, data }, meta: { callbacks } } },
    dispatch,
    done
  ) {
    Promise.all(
      data.map(d => api.get(`/etl/ds/${id}/field-type/maping`, {
        params: { sourceFieldType: d.columnType, sourceDataSize: d.datasize, targetDsId }
      }))
    ).then(res => {
      if (callbacks.success) {
        callbacks.success(res.map((item, index) => ({ data: data[index], item })));
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

const fieldListLogic = createLogic({
  type: types.FIELD_LIST,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { sourceDbType }, meta: { callbacks } } }, dispatch, done) {
    api
      .get('/etl/ds/field-type/list', {
        params: { sourceDbType }
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

const autoTargetLogic = createLogic({
  type: types.AUTO_TARGET,
  transform({ getState, action }, next) {
    next({
      ...action
    });
  },
  process({ api, action: { payload: { id, data }, meta: { callbacks } } }, dispatch, done) {
    api
      .post(`/etl/ds/${id}/auto-target`, {
        data
      })
      .then(data => {
        dispatch(getDatasourceTablesByDsId(id));
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
  loadEtlListLogic,
  loadEtlListAllLogic,
  loadEtlLogic,
  deleteEtlLogic,
  dynamicTableLogic,
  updateDynamicTableLogic,
  deleteDynamicTableLogic,
  dynamicTablePreviewLogic,
  fieldMappingLogic,
  fieldMappingAllLogic,
  fieldListLogic,
  autoTargetLogic
];
