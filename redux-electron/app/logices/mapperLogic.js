import { createLogic } from 'redux-logic';
import { generate as getId } from 'shortid';
import { get as _get, uniq, isEmpty } from 'lodash';
import * as types from '../reducers/etl/types';
import actions from '../reducers/etl/actions';
import { selectMapper, selectTable } from '../reducers/etl/selector';

const { etl: { addMapperEntity, doSelect } } = actions;

const addMapperLogic = createLogic({
  type: types.ADD_MAPPER,
  transform({ getState, action }, next) {
    const { payload: { id = getId(), mapper } } = action;
    // if (!mapper) {

    // }
    const newMapper = {
      tables: {},
      ports: {},
      links: {},
      x: 0,
      y: 0,
      datasource: {},
      ...mapper
    };
    next({
      ...action,
      payload: {
        ...action.payload,
        id,
        mapper: newMapper
      }
    });
  },
  process({ api, action: { payload: { id, mapper } } }, dispatch, done) {
    dispatch(addMapperEntity({ [id]: mapper }));
    dispatch(doSelect({ id, type: 'table' }));
    done();
  }
});

const updateMapperLogic = createLogic({
  type: types.UPDATE_MAPPER,
  transform({ getState, action }, next) {
    const state = getState();
    const { payload: { mapper } } = action;
    const id = _get(state, 'etl.current.mapperId', ''); // 获取当前mapper ID
    const newMapper = JSON.parse(JSON.stringify(mapper));

    next({
      ...action,
      payload: {
        ...action.payload,
        id,
        mapper: {
          ...newMapper
        }
      }
    });
  },
  process({ api, action: { payload: { id, mapper } } }, dispatch, done) {
    dispatch(addMapperEntity({ [id]: mapper }));
    done();
  }
});

const saveMapperPropLogic = createLogic({
  type: types.SAVE_MAPPER_PROP,
  transform({ getState, action }, next) {
    const state = getState();
    const { payload: { id, type, data } } = action;
    const mid = _get(state, 'etl.current.mapperId', ''); // 获取当前mapper ID
    const mapper = selectMapper(state, mid);

    if (type == 'column') {
      mapper.ports[id] = {
        ...mapper.ports[id],
        ...data
      };
    } else if (type == 'canvas') {
      mapper.options = data;
    }

    next({
      ...action,
      payload: {
        ...action.payload,
        id: mid,
        mapper
      }
    });
  },
  process({ api, action: { payload: { id, mapper } } }, dispatch, done) {
    dispatch(addMapperEntity({ [id]: mapper }));
    // dispatch(doSelect({ id, type: 'table' }));
    done();
  }
});

const saveMapperLogic = createLogic({
  type: types.SAVE_MAPPER,
  transform({ getState, action }, next) {
    const state = getState();
    const { payload: { id } } = action;
    const mid = _get(state, 'etl.current.mapperId', ''); // 获取当前mapper ID
    const mapper = selectMapper(state, mid);

    const linkKeys = Object.keys(mapper.links);

    const tableKeys = Object.keys(mapper.tables);
    const columnMappers = [];

    linkKeys.forEach(key => {
      // 1. 获取连接线目标Column key 和源Column key
      const targetKey = mapper.links[key].targetPort;
      const sourceKey = mapper.links[key].sourcePort;
      // 2. 获取目标Column 和源Column
      const targetPort = mapper.ports[targetKey];
      const sourcePort = mapper.ports[sourceKey];

      // 3. 获取源Column的表
      const sourceTable = mapper.tables[sourcePort.tableId];
      // 4. 查看目标Port是否存在columnMappers
      const cm = columnMappers.find(cm => cm.targetColumnName == targetPort.columnName);
      const opt = _get(sourcePort, 'options', {});
      if (isEmpty(cm)) {
        // 5. 不存在  添加新的columnMapper
        columnMappers.push({
          script: targetPort.script,
          targetColumnName: targetPort.columnName,
          transformer: targetPort.transformer,
          type: targetPort.columnType,
          mapperItems: [
            {
              // 5.1 添加连接的源字段
              sourceColumnName: opt[targetKey] || sourcePort.columnName,
              sourceTableName: sourceTable.name,
              type: sourcePort.columnType
              // sourceColumnName: sourcePort.sourceColumnName || sourcePort.columnName,
              // sourceTableName: sourceTable.name,
              // type: sourcePort.columnType
            }
          ]
        });
      } else {
        // 6. 存在columnMappers 追加源字段
        cm.mapperItems.push({
          sourceColumnName: opt[targetKey] || sourcePort.columnName,
          sourceTableName: sourceTable.name,
          type: sourcePort.columnType
        });
      }
    });

    // 3. 抽取目标和源Datasource ID
    const targetTableKey = tableKeys.find(key => mapper.tables[key].type == 'target');
    // targetTable.length > 0
    const targetDsId = mapper.tables[targetTableKey].dsId;
    const sourceTableKey = tableKeys.find(key => mapper.tables[key].type == 'source');
    const sourceDsId = mapper.tables[sourceTableKey].dsId;

    // 4. 组装Layout
    // 4.1 组装Table
    // const nodes = tableKeys.map(key => {
    //   mapper.tables[key]
    // });

    // 4. 组装Mapper
    const data = {
      id,
      ...mapper.options,
      columnMappers,
      targetDatasource: targetDsId,
      sourceDatasource: sourceDsId,
      dynamicSourceTableName: mapper.tables[sourceTableKey].name,
      sourceTableType: mapper.tables[sourceTableKey].sourceTableType,
      layout: JSON.stringify({ id: mid, mapper })
    };

    next({
      ...action,
      payload: {
        ...actions.payload,
        data
      }
    });
  },
  process({ api, action: { payload: { data }, meta: { callbacks } } }, dispatch, done) {
    api
      .post('/etl/table-mapper', { data })
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




const savePutMapperLogic = createLogic({
  type: types.SAVE_MAPPER,
  transform({ getState, action }, next) {
    const state = getState();
    const { payload: { id } } = action;
    const mid = _get(state, 'etl.current.mapperId', ''); // 获取当前mapper ID
    const mapper = selectMapper(state, mid);

    const linkKeys = Object.keys(mapper.links);

    const tableKeys = Object.keys(mapper.tables);
    const columnMappers = [];

    linkKeys.forEach(key => {
      // 1. 获取连接线目标Column key 和源Column key
      const targetKey = mapper.links[key].targetPort;
      const sourceKey = mapper.links[key].sourcePort;
      // 2. 获取目标Column 和源Column
      const targetPort = mapper.ports[targetKey];
      const sourcePort = mapper.ports[sourceKey];

      // 3. 获取源Column的表
      const sourceTable = mapper.tables[sourcePort.tableId];
      // 4. 查看目标Port是否存在columnMappers
      const cm = columnMappers.find(cm => cm.targetColumnName == targetPort.columnName);
      const opt = _get(sourcePort, 'options', {});
      if (isEmpty(cm)) {
        // 5. 不存在  添加新的columnMapper
        columnMappers.push({
          script: targetPort.script,
          targetColumnName: targetPort.columnName,
          transformer: targetPort.transformer,
          type: targetPort.columnType,
          mapperItems: [
            {
              // 5.1 添加连接的源字段
              sourceColumnName: opt[targetKey] || sourcePort.columnName,
              sourceTableName: sourceTable.name,
              type: sourcePort.columnType
              // sourceColumnName: sourcePort.sourceColumnName || sourcePort.columnName,
              // sourceTableName: sourceTable.name,
              // type: sourcePort.columnType
            }
          ]
        });
      } else {
        // 6. 存在columnMappers 追加源字段
        cm.mapperItems.push({
          sourceColumnName: opt[targetKey] || sourcePort.columnName,
          sourceTableName: sourceTable.name,
          type: sourcePort.columnType
        });
      }
    });

    // 3. 抽取目标和源Datasource ID
    const targetTableKey = tableKeys.find(key => mapper.tables[key].type == 'target');
    // targetTable.length > 0
    const targetDsId = mapper.tables[targetTableKey].dsId;
    const sourceTableKey = tableKeys.find(key => mapper.tables[key].type == 'source');
    const sourceDsId = mapper.tables[sourceTableKey].dsId;

    // 4. 组装Layout
    // 4.1 组装Table
    // const nodes = tableKeys.map(key => {
    //   mapper.tables[key]
    // });

    // 4. 组装Mapper
    const data = {
      id,
      ...mapper.options,
      columnMappers,
      targetDatasource: targetDsId,
      sourceDatasource: sourceDsId,
      dynamicSourceTableName: mapper.tables[sourceTableKey].name,
      sourceTableType: mapper.tables[sourceTableKey].sourceTableType,
      layout: JSON.stringify({ id: mid, mapper })
    };

    next({
      ...action,
      payload: {
        ...actions.payload,
        data
      }
    });
  },
  process({ api, action: { payload: { data }, meta: { callbacks } } }, dispatch, done) {
    api
      .put('/etl/table-mapper', { data })
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
  addMapperLogic,
  updateMapperLogic,
  saveMapperPropLogic,
  saveMapperLogic,
  savePutMapperLogic
];
