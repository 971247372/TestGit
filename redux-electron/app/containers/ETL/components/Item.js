import React, { Component, PropTypes } from 'react';
import { dragWrapper } from '../../../HOC';
import styles from './style.scss';

class Item extends Component {
  render() {
    const { type, suffix, tableType } = this.props;
    const borderColor = type == 'target' ? '#fd9130' : '#6ca8ed';
    return (
      <div className={styles['ds-item']} style={{ borderColor }}>
        <span>{this.props.name}</span>
        {suffix}
      </div>
    );
  }
}

Item.propTypes = {
  name: PropTypes.string,
  tableType: PropTypes.string,
  type: PropTypes.string,
  suffix: PropTypes.any,
};

export default dragWrapper(Item);
