import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';
import moment from 'moment';
import { Table, Spin, Card } from 'antd';
import SearchForm from './components/SearchForm';
import actions from '../../reducers/log/actions';
import styles from './style.scss';

import { LitBreadcrumb } from '../../components';

const { log: { loadJobLogList, loadLogList } } = actions;

class Log extends Component {
  constructor(props) {
    super(props);
    const params = _get(props.match, 'params', {});
    this.state = {
      taskId: params.id,
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: (total, range) => `当前${range[0]}-${range[1]}条 共${total}条记录`,
        showQuickJumper: true
      },
      conditionData: {},
    };
  }

  componentDidMount() {
    this.queryList();
    // this.queryLog(1);
  }

  // onFush = () => {
  //   this.queryLog(this.state.pagination.current);
  // };

  onSearch = data => {
    this.setState({ conditionData: data });
    this.queryList(1, 10, data || {});
  }

  onHandleChange = pagination => {
    this.setState({ pagination: { current: pagination.current } });
    this.queryList(pagination.current, 10, this.state.conditionData);
  };

  getDate = date => {
    if (!date) return '';
    return moment(date).format('YYYY年MM月DD, HH:mm:ss SS');
  };

  queryList = (page = 1, rows = 10, condition) => {
    this.props.loadLogList(page, rows, condition);
  }

  queryLog = page => {
    this.props.loadJobLogList(this.state.taskId, page, 10);
  };

  get columns() {
    return [
      {
        title: '任务名称',
        dataIndex: 'jobName',
        key: 'jobName'
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: text => this.getDate(text)
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: text => this.getDate(text)
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => this.renderStatus(text)
      }
    ];
  }

  expandedRowRender = record => {
    if (!record.etlDataTransactionLogs) {
      return null;
    }
    const columns = [
      {
        title: '名称',
        dataIndex: 'tableMapperName',
        key: 'tableMapperName',
        render: (text, record) => text || record.tableMapperId
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: text => this.getDate(text)
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: text => this.getDate(text)
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => this.renderStatus(text)
      }
    ];
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={record.etlDataTransactionLogs}
        pagination={false}
      />
    );
  };

  renderStatus = text => {
    switch (text) {
      case 'FAILED':
        return <span className={styles[text.toLowerCase()]}>失败</span>;
      case 'SUCCESS':
        return <span className={styles[text.toLowerCase()]}>成功</span>;
      case 'RUNNING':
        return <span className={styles[text.toLowerCase()]}>执行中</span>;
      case 'WAIT':
        return <span className={styles[text.toLowerCase()]}>待执行</span>;
      default:
        return text;
    }
  }

  render() {
    const { loading, logList, count } = this.props;
    const pagination = {
      ...this.state.pagination,
      total: count
    };
    const breadcrumbItems = [
      { icon: 'fa-list-alt', url: '/job', name: '任务管理' },
      { icon: 'fa-file-text-o', name: '查看日志' }
    ];
    return (
      <Spin spinning={loading}>
        <div style={{ lineHeight: '41px', marginLeft: 5, width: '100%' }}>
          <LitBreadcrumb items={breadcrumbItems} />
        </div>
        <div style={{ width: '100%' }}>
          <Card title="日志查看">
            <SearchForm onSearch={this.onSearch} />
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={logList}
              pagination={pagination}
              onChange={this.onHandleChange}
              expandedRowRender={this.expandedRowRender}
            />
          </Card>
        </div>
      </Spin>
    );
  }
}

Log.propTypes = {
  logList: PropTypes.array,
  loading: PropTypes.bool,
  count: PropTypes.number,
  match: PropTypes.object,
  loadLogList: PropTypes.func,
  loadJobLogList: PropTypes.func
};

const mapStateToProps = state => ({
  logList: _get(state, 'log.list', []),
  count: _get(state, 'log.total', 0),
  loading: _get(state, 'log.loading', true)
});

export default connect(mapStateToProps, { loadJobLogList, loadLogList })(Log);
