import React, { PropTypes } from 'react';
import PortWidget from './PortWidget';

export default class EtlPortLabel extends React.Component {
  static propTypes = {
    model: PropTypes.object
  };

  render() {
    const { model } = this.props;
    const label = (
      <div className="name" style={{ textAlign: 'center', margin: '0 20px' }}>
        {model.label}
      </div>
    );

    return (
      <div style={{ margin: '5px 0' }}>
        {model.in && model.parentNode.type == 'target' && <PortWidget name={model.name} align="left" node={model.parentNode} selected={model.selected} />}
        {model.out && model.parentNode.type == 'source' && <PortWidget name={model.name} align="right" node={model.parentNode} selected={model.selected} />}
        {label}
      </div>
    );
  }
}
