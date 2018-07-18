import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import styles from './style.scss';

export default class ColEditor extends React.PureComponent {
  static propTypes = {
    colName: PropTypes.string,
    onOk: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      colValue: props.colName
    };
  }

  onColEdit = () => {
    this.setState({ visible: true });
  };

  onColChange = e => {
    this.setState({ colValue: e.target.value });
  };

  onOk = () => {
    const { onOk } = this.props;
    if (onOk) {
      onOk(this.state.colValue);
      this.setState({ visible: false });
    }
  };

  onClose = () => {
    this.setState({ colValue: this.props.colName, visible: false });
  };

  render() {
    const { colName } = this.props;
    const { visible, colValue } = this.state;
    return (
      <div className={styles.colEdit}>
        {!visible && <span>{colName}</span>}
        {visible && <Input style={{ width: 80 }} value={colValue} onChange={this.onColChange} />}
        {visible && (
          <span>
            <Icon type="check" className={styles.colCheckIcon} onClick={this.onOk} />{' '}
            <Icon type="close" className={styles.colCloseIcon} onClick={this.onClose} />
          </span>
        )}
        {!visible && <Icon type="edit" className={styles.colEditIcon} onClick={this.onColEdit} />}
      </div>
    );
  }
}
