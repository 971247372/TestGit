import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get as _get, isEmpty } from 'lodash';
import { selectCurrentMapper } from '../../../reducers/etl/selector';
import ColPropForm from './ColPropForm';
import CanvasPropForm from './CanvasPropForm';

const PropForm = ({ mapperLoading, current, mapper }) => {
  if (!mapper && !mapperLoading) {
    return null;
  }
  const colData = mapper.ports[current.id];
  if (!mapper) {
    return null;
  }
  if (current.type == 'column' && colData && colData.linked) {
    return <ColPropForm current={current} mapper={mapper} data={colData} />;
  } else if (current.type == 'canvas' && !isEmpty(mapper.tables)) {
    return <CanvasPropForm current={current} mapper={mapper} data={mapper.options} />;
  }
  return null; // 👈 unsupported type
};

PropForm.propTypes = {
  mapperLoading: PropTypes.bool,
  current: PropTypes.object,
  mapper: PropTypes.object
};

const mapStateToProps = state => ({
  current: _get(state, 'etl.current', {}),
  mapper: selectCurrentMapper(state),
});

export default connect(mapStateToProps)(PropForm);
