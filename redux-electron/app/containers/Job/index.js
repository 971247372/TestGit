import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';
import { start } from 'repl';
import {
  Table,
  Button,
  Switch,
  Spin,
  Card,
  notification,
  Modal,
  Input,
  Row,
  Col,
  Badge,
  Icon
} from 'antd';
import { push } from 'react-router-redux';
import actions from '../../reducers/job/actions';
import DetailForm from './components/DetailForm';
import tableAction from '../../reducers/etl/actions';
const confirm = Modal.confirm;

const { job: { loadJobList, loadJobStatus, loadJobCron, deleteJob, addJob } } = actions;

const { etl: { loadEtlListAll } } = tableAction;

class Job extends Component {
  static propTypes = {
    loadJobStatus: PropTypes.func
    // loadDatasourceList: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      jobList: this.props.list,
      visible: false,
      confirmLoading: false,
      cronValue: '',
      currenId: '',
      formVisible: false,
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
    this.props.loadJobList();
    this.props.loadEtlListAll();
  }

  onLogDetail = (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.pushState('/log/' + row.taskId);
  };

  onDetail = record => {
    if (record.status) {
      notification.warning({
        message: `任务[ ${record.name} 未关闭]`
      });
      return;
    }
    this.setState({
      visible: true,
      cronValue: record.cronExpressions,
      currenId: record.id
    });
  };

  onAddBox = () => {
    this.setState({ formVisible: true });
  };

  onHandleChange = pagination => {
    this.setState({ pagination: { current: pagination.current } });
  };

  onHandleOk = () => {
    const { validateFields } = this.detailForm;
    const { loadJobList, addJob } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (values.dependType == 'join' && values.dependedMapperIds.length == 0) {
          notification.warning({
            message: '未添加依赖'
          });
          return;
        }
        if (values.dependedMapperIds) {
          const dependedMapperIds = values.dependedMapperIds.filter(id => id != '');
          if (dependedMapperIds.length == 0) {
            notification.warning({
              message: '未添加依赖'
            });
            return;
          }
          values = { ...values, dependedMapperIds };
        }
        this.props.addJob(values, {
          success: () => {
            notification.success({
              message: '添加成功'
            });
            this.closeFormModal();
            this.props.loadEtlListAll();  // 刷新映射列表
            this.props.loadJobList();
          },
          fail(err) {
            notification.error({
              message: '添加错误！',
              description: err.message || ''
            });
          }
        });
      }
    });
  };

  setAddVisible = () => {
    this.setState({ addVisible: false });
  };

  switch = row => {
    this.props.loadJobStatus(row.id, row.status ? 'close' : 'open', {
      success: () => {
        this.setState({ addVisible: false });
        notification.success({
          message: '操作成功'
        });
        this.props.loadJobList();
      },
      fail(err) {
        notification.error({
          message: '操作错误！',
          description: err.error_message
        });
      }
    });
  };

  closeFormModal = () => {
    this.setState({ formVisible: false });
  };

  expandedRowRender = record => {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => record.main ? (
          <Badge status="processing" text={text} />
          ) : (
            <Badge status="default" text={text} />
          )
      },
      {
        title: '源数据源',
        dataIndex: 'sourceDataSourceName',
        key: 'sourceDataSourceName'
      },
      {
        title: '源表',
        dataIndex: 'sourceTableNames',
        key: 'sourceTableNames'
      },
      {
        title: '目标源',
        dataIndex: 'targetDataSourceName',
        key: 'targetDataSourceName'
      },
      {
        title: '目标表',
        dataIndex: 'targetTableName',
        key: 'targetTableName'
      }
    ];
    return (
      <Table
        rowKey="mapperId"
        columns={columns}
        dataSource={record.tableMapperInfoList}
        pagination={false}
      />
    );
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    this.props.loadJobCron(this.state.currenId, this.state.cronValue, {
      success: () => {
        notification.success({
          message: '修改成功'
        });
        this.setState({
          visible: false,
          confirmLoading: false
        });
        this.props.loadJobList();
      },
      fail(err) {
        notification.error({
          message: '操作错误！',
          description: err.error_message
        });
      }
    });
    this.setState({
      confirmLoading: false
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  beforDelete = (id, record) => {
    const { deleteJob, loadJobList } = this.props;
    confirm({
      title: '确定删除[ ' + record.name + ' ]?',
      onOk() {
        if (record.status) {
          notification.warning({
            message: `任务[ ${record.name} 未关闭]`
          });
          return;
        }
        deleteJob(id, {
          success: () => {
            notification.success({
              message: '删除成功'
            });
            loadJobList();
          },
          fail(err) {
            notification.error({
              message: '操作错误！',
              description: err.message
            });
          }
        });
      }
    });
  };

  render() {
    const { list, loading, tableList } = this.props;
    const { visible, confirmLoading, cronValue, formVisible } = this.state;
    // const { current } = this.state.pagination;
    // const pagination = {
    //   ...this.state.pagination,
    //   total: list.lengh
    // };
    const columns = [
      // {
      //   title: '日志',
      //   dataIndex: 'id',
      //   key: 'id',
      //   render: (text, record) => <a onClick={e => this.onLogDetail(e, record)}>查看日志</a>
      // },
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '定时器',
        dataIndex: 'cronExpressions',
        key: 'cronExpressions'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            checked={text}
            onChange={checked => this.switch(record)}
          />
        )
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <div>
            <a onClick={e => this.onDetail(record)}>
              <Icon type="setting" />
            </a>
            <a onClick={e => this.beforDelete(record.id, record)} style={{ marginLeft: '20px' }}>
              <Icon type="delete" />
            </a>
          </div>
        )
      }
    ];
    const extra = (
      <Button type="primary" icon="plus" onClick={this.onAddBox}>
        新增
      </Button>
    );
    return (
      <Spin spinning={loading}>
        <Card title="任务管理" extra={extra}>
          <Table
            rowKey="id"
            dataSource={list}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.onHandleChange}
            expandedRowRender={this.expandedRowRender}
            style={{ textAlign: 'center' }}
          />
          <Modal
            title="设置定时器"
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <Row>
              <Col span={24} style={{ marginBottom: 10 }}>
                <Col span={4} style={{ fontWeight: 'bold' }}>
                  cron
                </Col>
                <Col span={20}>
                  <Input
                    value={cronValue}
                    onChange={event => this.setState({ cronValue: event.target.value })}
                  />
                </Col>
              </Col>
            </Row>
          </Modal>
          <Modal
            visible={formVisible}
            title="添加JOB"
            maskClosable={false}
            key={new Date()}
            destroyOnClose
            onCancel={this.closeFormModal}
            footer={[
              <Button key="back" onClick={this.closeFormModal}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={this.onHandleOk}>
                提交
              </Button>
            ]}
          >
            <DetailForm ref={node => (this.detailForm = node)} etlList={tableList} />
          </Modal>
        </Card>
      </Spin>
    );
  }
}

Job.propTypes = {
  list: PropTypes.array,
  tableList: PropTypes.array,
  loading: PropTypes.bool,
  loadJobList: PropTypes.func,
  loadJobCron: PropTypes.func,
  loadJobStatus: PropTypes.func,
  deleteJob: PropTypes.func,
  addJob: PropTypes.func,
  pushState: PropTypes.func,
  loadEtlListAll: PropTypes.func
};

const mapStateToProps = state => ({
  list: _get(state, 'job.list', []),
  tableList: _get(state, 'etl.allList', []),
  loading: _get(state, 'job.loading', true)
});

export default connect(mapStateToProps, {
  loadJobList,
  loadJobCron,
  loadJobStatus,
  deleteJob,
  addJob,
  loadEtlListAll,
  pushState: push
})(Job);
