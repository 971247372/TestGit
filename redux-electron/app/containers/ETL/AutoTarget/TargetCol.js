import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select, Card, Row, Col, Icon, Steps, Table } from 'antd';
import ColEditor from './ColEditor';
import styles from './style.scss';

const Option = Select.Option;

export default class TargetCol extends React.PureComponent {
  static propTypes = {
    scroll: PropTypes.object,
    colData: PropTypes.array,
    fieldList: PropTypes.array,
    onRemoveRow: PropTypes.func,
    onFieldChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      visible: false,
      step: 0
    };
  }

  onRemoveRow = item => () => {
    const { onRemoveRow } = this.props;
    if (onRemoveRow) {
      onRemoveRow(item);
    }
  }

  renderHeader = () => {
    const { colData } = this.props;
    // return colData.map(col => <th>{col.}</th>);
  }

  render() {
    const { colData, scroll, onFieldChange, fieldList = [] } = this.props;
    const style = scroll ? { maxHeight: scroll.y, overflowY: 'auto' } : {};
    return (
      <div style={style}>
        <table cellPadding="0" cellSpacing="0" className={styles.colTable}>
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>长度</th>
            </tr>
          </thead>
          <tbody>
            {colData.map(col => (
              <tr key={col.id} className={styles.colRow}>
                <td>
                  <ColEditor colName={col.columnName} onOk={onFieldChange(col, 'columnName')} />
                </td>
                <td width={100}>
                  <Select style={{ width: 80 }} onChange={onFieldChange(col, 'columnType')} defaultValue={col.columnType}>
                    {fieldList.map((field, idx) => <Option key={idx} value={field}>{field}</Option>)}
                  </Select>
                </td>
                <td>
                  <ColEditor colName={col.datasize} onOk={onFieldChange(col, 'datasize')} />
                  <Icon type="delete" className={styles.colRowDelete} onClick={this.onRemoveRow(col)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
