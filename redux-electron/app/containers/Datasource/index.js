import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';
import { Table, Spin, Card, notification, Icon, Modal, Button } from 'antd';
import actions from '../../reducers/datasource/actions';
import DetailForm from './components/DetailForm';
import styles from './styles.scss';

const confirm = Modal.confirm;

const { datasource: { loadDatasourceList, loadDatasourceAdd, deleteDatasource } } = actions;

class Datasource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasource: props.list,
      loading: false,
      visible: false,
      ds: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: (total, range) => `当前${range[0]}-${range[1]}条 共${total}条记录`,
        showQuickJumper: true,
        total: props.list.length
      }
    };
  }

  componentDidMount() {
    this.props.loadDatasourceList();
  }

  onHandleOk = (data, callbacks) => {
    const datasource = {};
    datasource.url = data.url;
    datasource.type = data.type;
    datasource.user = data.user;
    datasource.password = data.password;
    datasource.name = data.name;
    if (data.id) {
      datasource.id = data.id;
    }
    this.props.loadDatasourceAdd(datasource, {
      success: () => {
        notification.success({
          message: '操作成功'
        });
        this.setState({ visible: false });
        callbacks.success();
        this.props.loadDatasourceList();
      },
      fail: err => {
        notification.error({
          message: '操作失败',
          description: err.message || ''
        });
        // callbacks.success();
      }
    });
  };
  onChange = data => {
    this.setState({ ds: data });
  };

  onAddBox = () => {
    this.setState({ ds: {}, visible: true });
  };

  onHandleChange = pagination => {
    this.setState({ pagination: { current: pagination.current } });
  };

  beforEdit = data => {
    this.setState({ ds: data, visible: true });
  };

  beforDelete = (record, index) => {
    const { deleteDatasource, loadDatasourceList } = this.props;
    confirm({
      title: `确定删除[ ${record.name} ]?`,
      onOk() {
        deleteDatasource(record.id, {
          success: () => {
            notification.success({
              message: '操作成功'
            });
            loadDatasourceList();
          },
          fail: err => {
            notification.error({
              message: '操作失败',
              description: err.message || ''
            });
          }
        });
      }
    });
  };

  get columns() {
    return [
      {
        title: '序列',
        dataIndex: '',
        key: '',
        render: (text, record, index) => index + 1
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <span>
            <img
              alt=""
              className={styles.dsIcon}
              src={require(`./dbImg/${record.type.toLowerCase()}.png`)}
            />
            <span>{text}</span>
          </span>
        )
      },
      {
        title: '数据库',
        dataIndex: 'url',
        key: 'url'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 100
      },
      {
        title: '用户名',
        dataIndex: 'user',
        key: 'user',
        width: 100
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
        width: 80,
        render: (text, record, index) => (
          <div>
            <a onClick={e => this.beforEdit(record)}>
              <Icon type="setting" />{' '}
            </a>
            <a onClick={e => this.beforDelete(record, index)} style={{ marginLeft: '20px' }}>
              <Icon type="delete" />
            </a>
          </div>
        )
      }
    ];
  }

  render() {
    const { list, loading } = this.props;
    const { ds, visible } = this.state;
    // const { current } = this.state.pagination;
    // const pagination = {
    //   ...this.state.pagination,
    //   total: list.lengh
    // };

    const extra = (
      <Button type="primary" icon="plus" onClick={this.onAddBox}>
        新增
      </Button>
    );
    return (
      <Spin spinning={loading}>
        <DetailForm data={ds} onHandleOk={this.onHandleOk} visible={visible} />
        <Card title="数据源管理" extra={extra}>
          <Table
            rowKey="id"
            dataSource={list}
            columns={this.columns}
            style={{ textAlign: 'center' }}
            pagination={this.state.pagination}
            onChange={this.onHandleChange}
          />
        </Card>
      </Spin>
    );
  }
}

Datasource.propTypes = {
  loading: PropTypes.bool,
  list: PropTypes.array,
  loadDatasourceList: PropTypes.func,
  loadDatasourceAdd: PropTypes.func,
  deleteDatasource: PropTypes.func
};

const mapStateToProps = state => ({
  list: _get(state, 'datasource.list', []),
  loading: _get(state, 'datasource.loading', true)
});

export default connect(mapStateToProps, {
  loadDatasourceList,
  loadDatasourceAdd,
  deleteDatasource
})(Datasource);
