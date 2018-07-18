import React, { Component, PropTypes } from 'react';
import { Layout, Spin, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';
import { MenuTool } from '../../components';
import actions from '../../reducers/login/actions';
import appActions from '../../reducers/application/actions';
import styles from './style.scss';

const AntMenu = require('antd').Menu;
const { Header, Content, Sider, Footer } = Layout;
const { login: { checkLogin } } = actions;
const { application: { appReload } } = appActions;

class App extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    const pathname = location.pathname == '/' ? '/ds' : location.pathname;
    this.state = {
      selectedKeys: pathname.includes('/etl')
        ? '/etl'
        : pathname.includes('/log') ? '/job' : pathname
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    const pathname = location.pathname == '/' ? '/ds' : location.pathname;
    this.state = {
      selectedKeys: pathname.includes('/etl')
        ? '/etl'
        : pathname.includes('/log') ? '/job' : pathname
    };
  }

  onChange = (e, path) => {
    const { location } = this.props;
    // const pathName = _get(location, 'pathname', '');
    if (location.pathname == path) return;
    e.preventDefault();
    e.stopPropagation();
    this.setState({ selectedKeys: path });
    this.props.pushState(path);
  };

  handleLogout = () => {
    this.props.pushState('/');
    this.props.checkLogin(false);
  };

  handleReload = () => {
    this.props.appReload();
  };

  render() {
    const menus = [
      { name: '数据源管理', path: '/ds', icon: 'database' },
      // { name: 'login', path: '/login', icon: 'setting' },
      { name: '映射管理', path: '/etl', icon: 'fa-file-text-o' },
      { name: '任务管理', path: '/job', icon: 'fa-list-alt' },
      { name: '日志', path: '/log', icon: 'fa-list-alt' },
      { name: '邮箱配置', path: '/email', icon: 'fa-list-alt' },
    ];
    const { logined, loading } = this.props;
    const { selectedKeys } = this.state;
    const clazz = logined
      ? { width: '100vw', height: '100vh' }
      : { width: '100vw', height: '100vh', display: 'none' };
    return (
      <Spin spinning={loading}>
        <Layout style={clazz}>
          <Sider
            style={{
              background: '#404040',
              color: 'rgba(255, 255, 255, 0.67)',
              height: '100vh',
              zIndex: 999
            }}
          >
            <div style={{ display: 'inline-block', width: 'auto', height: 64, paddingTop: '20px' }}>
              <img
                src={require('./logo.png')}
                className="logo"
                alt=""
                style={{ height: '30px', margin: '-5px 0 0 20px', verticalAlign: 'middle' }}
              />
              <div
                style={{
                  display: 'inline',
                  fontSize: '1.5em',
                  color: '#CCC',
                  marginLeft: '10px',
                  marginTop: '5px'
                }}
              >
                <span>Lean-ETL</span>
              </div>
            </div>
            <AntMenu
              mode="inline"
              theme="dark"
              selectedKeys={[selectedKeys]}
              style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}
            >
              {menus.map(m => (
                <AntMenu.Item key={m.path}>
                  <a onClick={e => this.onChange(e, m.path)}>
                    {m.icon.indexOf('fa-') < 0 && <Icon type={m.icon} />}
                    {m.icon.indexOf('fa-') >= 0 && (
                      <i
                        className={`fa ${m.icon}`}
                        style={{ marginRight: 8, marginLeft: 2, minWidth: 14 }}
                      />
                    )}
                    {m.name}
                  </a>
                </AntMenu.Item>
              ))}
            </AntMenu>
          </Sider>
          <Layout className="lean-layout">
            <Header className="nav-tools" style={{ zIndex: 999 }}>
              <div style={{ color: '#fff', float: 'right' }}>
                <div className={styles['icon-link']} style={{ marginRight: '35px' }}>
                  <Icon type="user" />
                  <span>admin</span>
                </div>
                <div
                  className={styles['icon-link']}
                  style={{ marginRight: '35px' }}
                  onClick={this.handleReload}
                >
                  <Icon type="reload" />
                  <span>刷新</span>
                </div>
                <div className={styles['icon-link']} onClick={this.handleLogout}>
                  <i className="lean-etl lean-etl-logout" />
                  <span>退出</span>
                </div>
              </div>
            </Header>
            <Layout className="lean-content">
              <Content style={{ margin: 0, padding: 0 }}>{this.props.children}</Content>
              <Footer className={styles['lean-footer']} style={{ zIndex: 999 }}>
                苏州峰之鼎信息科技有限公司 Copyright &copy; 2017 - 2018 . All Rights Reserved.
              </Footer>
            </Layout>
          </Layout>
          <MenuTool />
        </Layout>
      </Spin>
    );
  }
}

App.propTypes = {
  logined: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.any,
  location: PropTypes.object,
  pushState: PropTypes.func,
  appReload: PropTypes.func,
  checkLogin: PropTypes.func
};

const mapStateToProps = state => ({
  logined: _get(state, 'login.logined', false),
  loading: _get(state, 'application.loading', false),
  location: _get(state, 'router.location', {})
});

export default withRouter(
  connect(mapStateToProps, { checkLogin, appReload, pushState: push })(App)
);
