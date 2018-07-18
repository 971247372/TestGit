import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { get as _get } from 'lodash';
import { Spin, Table, Card, Button, Modal, notification } from 'antd';
import actions from '../../reducers/etl/actions';

const confirm = Modal.confirm;
const { etl: { loadEtlList, deleteEtl, loadEtl } } = actions;

class ETL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: (total, range) => `当前${range[0]}-${range[1]}条 共${total}条记录`,
        showQuickJumper: true
      }
    };
  }

  componentDidMount() {
    this.props.loadEtlList(1);
  }

  onHandleChange = pagination => {
    this.setState({ pagination: { current: pagination.current } });
    this.queryList(pagination.current);
  };

  onCreate = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.pushState('/etl/create');
  };

  onDetail = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.pushState(`/etl/detail/${record.id}`);
    // this.props.loadEtl(record.id, {
    //   success: () => {
    //     this.props.pushState(`/etl/detail/${record.id}`);
    //   }
    // });
  };

  onDelete = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    const { deleteEtl } = this.props;
    const { queryList } = this;
    const { current } = this.state.pagination;
    confirm({
      title: `确认删除[ ${record.name || ''} ]?`,
      onOk() {
        deleteEtl(record.id, {
          success: () => {
            queryList(current);
            notification.success({
              message: '删除成功'
            });
          },
          fail: err => {
            notification.error({
              message: '删除失败',
              description: err.message || ''
            });
          }
        });
      },
      onCancel() { }
    });
  };
  findSourceTable = data => {
    if (data.columnMappers[0]) {
      if (data.columnMappers[0].mapperItems[0]) {
        return data.columnMappers[0].mapperItems[0].sourceTableName;
      }
    }
  }

  queryList = (page = 1) => {
    this.props.loadEtlList(page);
  };

  get columns() {
    return [
      {
        title: '序列',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => index + 1
      },
      // {
      //   title: 'ID',
      //   dataIndex: 'id',
      //   key: 'id'
      // },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '数据源',
        dataIndex: 'sourceName',
        key: 'sourceName'
      },
      {
        title: '源表',
        dataIndex: '',
        key: '',
        render: record => this.findSourceTable(record)
      },
      {
        title: '目标源',
        dataIndex: 'targetName',
        key: 'targetName'
      },
      {
        title: '目标表',
        dataIndex: 'targetTableName',
        key: 'targetTableName'
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        render: (text, record) => (
          <div>
            <a onClick={e => this.onDetail(e, record)} style={{ marginRight: 10 }}>
              <i className="fa fa-ellipsis-h" />
            </a>
            <a onClick={e => this.onDelete(e, record)}>
              <i className="fa fa-trash-o" />
            </a>
          </div>
        )
      }
    ];
  }

  render() {
    const { loading, list, total } = this.props;
    const pagination = {
      ...this.state.pagination,
      total
    };
    const extra = (
      <Button type="primary" icon="plus" onClick={this.onCreate}>
        新增
      </Button>
    );
    return (
      <Spin spinning={loading}>
        <Card title="映射管理" extra={extra}>
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={list}
            pagination={pagination}
            onChange={this.onHandleChange}
          />
        </Card>
      </Spin>
    );
  }
}

ETL.propTypes = {
  loading: PropTypes.bool,
  total: PropTypes.number,
  list: PropTypes.array,
  loadEtlList: PropTypes.func,
  deleteEtl: PropTypes.func,
  pushState: PropTypes.func
};

const mapStateToProps = state => ({
  list: _get(state, 'etl.list', []),
  loading: _get(state, 'etl.loading', true),
  total: _get(state, 'etl.total', 0)
});

export default connect(mapStateToProps, { loadEtlList, deleteEtl, loadEtl, pushState: push })(ETL);
