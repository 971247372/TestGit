import React from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, Row, Col, Icon } from 'antd';
import TargetCol from './TargetCol';
import TransferTable from './TransferTable';
import styles from './style.scss';

export default class Transfer extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    fieldList: PropTypes.array,
    sourceData: PropTypes.array,
    dsType: PropTypes.object,
    fieldMapping: PropTypes.func,
    fieldMappingAll: PropTypes.func,
    onTransferChange: PropTypes.func,
    onTableNameChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      colData: props.data || []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state = {
      colData: nextProps.data || []
    };
  }

  onChecked = item => e => {
    const { fieldMapping, dsType, onTransferChange } = this.props;
    const colData = [...this.state.colData];

    fieldMapping(dsType.sourceDsId, item.columnType, item.datasize, dsType.targetDsId, {
      success: data => {
        item = {
          ...item,
          sourceColName: item.columnName,
          columnType: data.type,
          datasize: data.dataSize,
          checked: e.target.checked
        };
        if (e.target.checked) {
          colData.push(item);
        } else {
          colData.splice(colData.findIndex(col => col.id == item.id), 1);
        }
        // colData.columnType = data.type;
        // colData.datasize = data.datasize;
        onTransferChange(colData);
        this.setState({ colData });
      }
    });
  };

  onRemoveTargetRow = item => {
    const colData = [...this.state.colData];
    colData.splice(colData.findIndex(col => col.id == item.id), 1);
    this.setState({ colData });
  };

  onFieldChange = (item, type) => value => {
    const colData = [...this.state.colData];
    const d = colData.find(c => c.id == item.id);
    d[type] = value;
    this.setState({ colData });
  };

  handleAllChecked = e => {
    const { fieldMappingAll, dsType, sourceData, onTransferChange } = this.props;
    if (!e.target.checked) {
      this.setState({ colData: [] });
      return;
    }
    fieldMappingAll(dsType.sourceDsId, dsType.targetDsId, sourceData, {
      success: res => {
        const colData = res.map(({ data, item }) => ({
          ...data,
          sourceColName: data.columnName,
          columnType: item.type,
          datasize: item.dataSize,
          checked: e.target.checked
        }));
        onTransferChange(colData);
        this.setState({ colData });
      }
    });
  };

  get columns() {
    const { colData } = this.state;
    return [
      {
        title: '名称',
        dataIndex: 'columnName',
        key: 'columnName'
      },
      {
        title: '类型',
        dataIndex: 'columnType',
        key: 'columnType'
      },
      {
        title: '长度',
        dataIndex: 'datasize',
        key: 'datasize'
      },
      {
        title: '选择',
        dataIndex: 'options',
        key: 'options',
        render: record => {
          const item = colData.find(data => record.id == data.id);
          return <Checkbox onChange={this.onChecked(record)} checked={!!(item && item.checked)} />;
        }
      }
    ];
  }

  get targetColumns() {
    return [
      {
        title: '名称',
        dataIndex: 'col',
        key: 'col'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
        render: record => (
          <div>
            <span>{record.length}</span>
            <Icon
              type="delete"
              className={styles.colRowDelete}
              onClick={this.onRemoveTargetRow(record)}
            />
          </div>
        )
      }
    ];
  }

  render() {
    const { sourceData, dsType, fieldList, onTableNameChange } = this.props;
    const { colData } = this.state;
    const scroll = { y: 248 };
    return (
      <div style={{ width: '100%', height: 330, border: '1px solid #e9e9e9', borderRadius: 2 }}>
        <Row gutter={4} style={{ padding: 5 }}>
          <Col span={12}>
            <div style={{ paddingLeft: 5 }}>
              <span>源表：</span>
              <img
                alt=""
                className={styles.dsIcon}
                src={require(`./dbImg/${dsType.sourceDsType.toLowerCase()}.png`)}
              />
              <span>{dsType.sourceTableName}</span>
            </div>
            <TransferTable
              rowKey="id"
              columns={this.columns}
              dataSource={sourceData}
              scroll={scroll}
            />
            <div style={{ margin: 10, float: 'right' }}>
              <Checkbox onChange={this.handleAllChecked} checked={colData.length == sourceData.length}>全选</Checkbox>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ paddingLeft: 5 }}>
              <span>目标表：</span>
              {dsType.targetDsType && (
                <img
                  alt=""
                  className={styles.dsIcon}
                  src={require(`./dbImg/${dsType.targetDsType.toLowerCase()}.png`)}
                />
              )}
              <Input
                value={dsType.targetTableName}
                style={{ width: 200 }}
                onChange={onTableNameChange}
              />
            </div>
            {/* <TransferTable rowKey="id" columns={this.targetColumns} dataSource={colData} scroll={scroll} /> */}
            <TargetCol
              colData={colData}
              onRemoveRow={this.onRemoveTargetRow}
              fieldList={fieldList}
              onFieldChange={this.onFieldChange}
              scroll={scroll}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
