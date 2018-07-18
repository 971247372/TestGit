import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Card, Table, Modal, notification } from 'antd';
import { generate as getId } from 'shortid';
import AceEditor from 'react-ace';
import 'brace/mode/mysql';
import 'brace/theme/sqlserver';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';
import styles from './style.scss';

export default class Preview extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    onPreview: PropTypes.func,
    onGenerate: PropTypes.func,
    handleUpdate: PropTypes.func
  };

  static defaultProps = {
    fieldList: [],
    funcList: []
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      tableName: '',
      dsId: '',
      id: '',
      name: '',
      errorMsg: '',
      tableValue: [],
      tableColumn: [],
      visible: false
    };
  }

  onQueryTextChange = value => {
    this.setState({
      value
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  onGenerateView = () => {
    const { onGenerate, handleUpdate } = this.props;
    const { id, dsId, name, tableName, value } = this.state;
    if (!value.trim()) {
      return;
    }
    if (id) {
      handleUpdate(dsId, name, tableName, value, {
        success: () => {
          notification.success({
            message: '修改成功'
          });
          this.setState({ visible: false });
        },
        fail: err => {
          this.setState({ errorMsg: err.message || err.err_message, tableColumn: [], tableValue: [] });
        }
      });
      return;
    }
    onGenerate(dsId, tableName, value, {
      success: () => {
        notification.success({
          message: '创建成功'
        });
        this.setState({ visible: false });
      },
      fail: err => {
        this.setState({ errorMsg: err.message || err.err_message, tableColumn: [], tableValue: [] });
      }
    });
  };

  onPreview = () => {
    const { onPreview } = this.props;
    const { dsId, value } = this.state;
    if (onPreview) {
      onPreview(dsId, value, {
        success: data => {
          this.setState({
            tableValue: (data.COLUMN_VALUE || []).map(cn => ({ ...cn, _$$$$$key: getId() })),
            tableColumn: data.COLUMN_NAME.map(cn => ({
              title: cn,
              dataIndex: cn,
              key: cn,
              width: 150
            }))
          });
        },
        fail: err => {
          this.setState({ errorMsg: err.message || err.error_message, tableColumn: [], tableValue: [] });
        }
      });
    }
  };

  openModal = (dsId, data = {}) => {
    this.setState({ visible: true, dsId, tableName: data.name, name: data.name, id: data.id, value: data.sql });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  handleChange = e => {
    this.setState({ tableName: e.target.value });
  };

  render() {
    const { value, tableValue, tableName, tableColumn, errorMsg, visible } = this.state;
    const modalFoot = (
      <Button type="primary" onClick={this.onGenerateView}>
        生成自定义SQL视图
      </Button>
    );
    return (
      <Modal
        visible={visible}
        onCancel={this.closeModal}
        width={720}
        footer={modalFoot}
        maskClosable={false}
      >
        <div style={{ margin: '20px 0' }}>
          <span>工作表名称</span>
          <Input
            style={{ width: 200, marginLeft: 10 }}
            value={tableName}
            onChange={this.handleChange}
          />
          <Button
            icon="caret-right"
            type="primary"
            style={{ float: 'right' }}
            onClick={this.onPreview}
          >
            预览
          </Button>
        </div>
        <div style={{ width: '100%', height: 200, border: '1px solid #e9e9e9', borderRadius: 2 }}>
          <AceEditor
            mode="mysql"
            theme="sqlserver"
            name="query-ace-editor"
            width="100%"
            height="100%"
            showGutter
            showPrintMargin={false}
            highlightActiveLine={false}
            onChange={this.onQueryTextChange}
            value={value}
            editorProps={{ $blockScrolling: true }}
            ref={ref => (this.editor = ref ? ref.editor : null)}
          />
        </div>
        <div className={styles.queryResult}>
          <Card title="数据预览" bodyStyle={{ padding: 0 }}>
            {tableColumn.length > 0 && (
              <Table
                rowKey="_$$$$$key"
                columns={tableColumn}
                dataSource={tableValue}
                pagination={false}
                scroll={{
                  x: tableColumn.length * 200 > 685 ? tableColumn.length * 200 : 685,
                  y: 200
                }}
              />
            )}
            {tableColumn.length == 0 && (
              <div style={{ padding: 24, color: '#f5222d' }}>{errorMsg}</div>
            )}
          </Card>
        </div>
      </Modal>
    );
  }
}
