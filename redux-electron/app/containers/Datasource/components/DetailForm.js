import React from 'react';
import PropTypes from 'prop-types';
import { Input, Row, Col, Modal, Button, notification, Steps } from 'antd';
import styles from '../styles.scss';

const Step = Steps.Step;

const steps = [
  {
    title: '选择数据源类型'
  },
  {
    title: '填写数据源信息'
  }
];

const dbtypeList = [
  {
    img: 'csv',
    type: 'CSV',
    urlPlaceholder: '支持FTP和智能匹配！'
  },
  {
    img: 'mysql',
    type: 'MYSQL'
  },
  {
    img: 'oracle',
    type: 'ORACLE'
  },
  {
    img: 'sqlserver',
    type: 'SQLServer'
  },
  {
    img: 'postgre',
    type: 'POSTGRE'
  },
  {
    img: 'greenplum',
    type: 'GREENPLUM'
  }
];
export default class DetailForm extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    data: PropTypes.object,
    onHandleOk: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      ...props.data,
      password: '',
      visible: props.visible,
      current: 0,
      placeholder: {
        urlplaceholder: '',
        passwordplaceholder: '',
        userplaceholder: '',
        nameplaceholder: ''
      }
    };
    if (this.props.data.id) {
      this.setState({ current: 1 });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state = {
      ...nextProps.data,
      password: '',
      current: 0,
      visible: nextProps.visible,
      placeholder: {
        urlplaceholder: '',
        passwordplaceholder: '',
        userplaceholder: '',
        nameplaceholder: ''
      }
    };
    if (nextProps.data.id) {
      this.setState({ current: 1 });
    }
  }

  onFieldChange = (type, value) => {
    this.setState({
      [type]: value
    });
  };

  onHandleOk = () => {
    const { url, type, user, name, password, id } = this.state;
    this.setState({ loading: true });
    if (!name) {
      notification.warning({
        message: '给数据源起个别名吧!'
      });
      this.setState({ loading: false });
      return;
    } else if (!url) {
      notification.warning({
        message: 'URL是必填项!'
      });
      this.setState({ loading: false });
      return;
    } else if (type != 'CSV') {
      if (!user) {
        notification.warning({
          message: '用户名是必填项!'
        });
        this.setState({ loading: false });
        return;
      } else if (!id) {
        if (!password) {
          notification.warning({
            message: '密码是必填项!'
          });
          this.setState({ loading: false });
          return;
        }
      }
    } else if (!type) {
      notification.warning({
        message: '数据源类型是必填项!'
      });
      this.setState({ loading: false });
      return;
    }
    const { onHandleOk } = this.props;
    if (onHandleOk) {
      onHandleOk(this.state, {
        success: () => {
          this.setState({ loading: false });
        }
      });
    }
  };

  onHiddenModal = () => {
    this.setState({
      visible: false
    });
  };

  onOkType = type => {
    this.setState({
      placeholder: {
        urlplaceholder: type.urlPlaceholder ? type.urlPlaceholder : 'jdbc连接数据的url'
      }
    });
    this.onFieldChange('type', type.type);
    this.setState({ current: 1 });
  };

  typeImg = (type, idx) => (
    <Col span={8} key={idx} style={{ padding: '0 10px' }} onClick={() => this.onOkType(type)}>
      <img alt={type} src={require(`../dbImg/${type.img}.png`)} className={styles.imgtype} />
    </Col>
  );

  pre = () => {
    this.onFieldChange('type', null);
    this.setState({ current: 0 });
  };

  footer = () => {
    const { current, loading = false } = this.state;
    if (current == 0) {
      return null;
    }
    return (
      <div>
        {this.state.current > 0 &&
          this.state.id == null && (
            <Button style={{ marginLeft: 8, float: 'left' }} onClick={() => this.pre()}>
              上一步
            </Button>
          )}
        {this.state.current === steps.length - 1 && (
          <Button type="primary" loading={loading} onClick={() => this.onHandleOk()}>
            完成
          </Button>
        )}
      </div>
    );
  };

  render() {
    const { url, user, name, password, id, current, type, visible } = this.state;
    const {
      urlplaceholder
    } = this.state.placeholder;
    const title = (
      <Steps current={current} style={{ width: '80%' }}>
        {steps.map(item => <Step key={item.title} title={item.title} />)}
      </Steps>
    );
    return (
      <div>
        <Modal
          visible={visible}
          title={title}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={this.onHiddenModal}
          footer={this.footer()}
        >
          <div>
            {current == 0 && (
              <Row>
                <Col span={24} style={{ marginBottom: 10 }}>
                  {dbtypeList.map((type, idx) => this.typeImg(type, idx))}
                </Col>
              </Row>
            )}
            {current == 1 && (
              <Row>
                <Col span={24} style={{ marginBottom: 10 }}>
                  <Col
                    span={5}
                    style={{ fontWeight: 'bold', textAlign: 'right', marginRight: '10px' }}
                  >
                    名称
                  </Col>
                  <Col span={18}>
                    <Input
                      placeholder="给数据源起个别名吧"
                      value={name}
                      size="large"
                      onChange={event => this.onFieldChange('name', event.target.value)}
                    />
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: 10 }}>
                  <Col
                    span={5}
                    style={{ fontWeight: 'bold', textAlign: 'right', marginRight: '10px' }}
                  >
                    URL
                  </Col>
                  <Col span={18}>
                    <Input
                      placeholder={urlplaceholder}
                      value={url}
                      size="large"
                      onChange={event => this.onFieldChange('url', event.target.value)}
                      required="required"
                    />
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: 10 }}>
                  <Col
                    span={5}
                    style={{ fontWeight: 'bold', textAlign: 'right', marginRight: '10px' }}
                  >
                    用户名
                  </Col>
                  <Col span={18}>
                    <Input
                      placeholder="请输入用户名"
                      value={user}
                      size="large"
                      onChange={event => this.onFieldChange('user', event.target.value)}
                    />
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: 10 }}>
                  <Col
                    span={5}
                    style={{ fontWeight: 'bold', textAlign: 'right', marginRight: '10px' }}
                  >
                    密码{' '}
                  </Col>
                  <Col span={18}>
                    <Input
                      placeholder={id ? '如不输入密码将使用旧密码' : '请输入密码'}
                      value={password}
                      type="password"
                      size="large"
                      onChange={event => this.onFieldChange('password', event.target.value)}
                    />
                  </Col>
                </Col>
                {false && type && type == 'ORACLE' && (
                  <Col span={24} style={{ marginBottom: 10 }}>
                    <Col
                      span={5}
                      style={{ fontWeight: 'bold', textAlign: 'right', marginRight: '10px' }}
                    >
                      Schema{' '}
                    </Col>
                    <Col span={18}>
                      <Input
                        placeholder="请输入Schema"
                        value={password}
                        size="large"
                        onChange={event => this.onFieldChange('schema', event.target.value)}
                      />
                    </Col>
                  </Col>
                )}
              </Row>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}
