import { get as _get } from 'lodash';

export const selectMapper = (state, id) => state.etl.mapper[id];

export const selectTable = (state, mapperId, tableName, dsId) => {
  const mapper = selectMapper(state, mapperId);
  const tables = _get(mapper, 'tables', []);
  return tables.filter(t => t.name == tableName && t.dsId == dsId);
};

export const selectCurrentMapper = state => {
  const mid = _get(state, 'etl.current.mapperId', '');
  return mid ? state.etl.mapper[mid] : {};
};
