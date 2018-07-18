import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Button, Input, message } from 'antd';
import { get as _get } from 'lodash';
import classnames from 'classnames';
import LoginForm from './LoginForm';
import styles from './style.scss';
import logo from './logo.png';
import inputStyles from './Input.scss';
import userIcon from './user.png';
import passIcon from './pass.png';
import capIcon from './captcha.png';
import infoIcon from './infoIcon.png';
import actions from '../../reducers/login/actions';

const Layout = require('antd').Layout;
const { Header, Footer } = Layout;
const { login: { checkLogin } } = actions;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }

  handleSubmit = () => {
    this.props.pushState('/ds');
    this.props.checkLogin(true);
  };
  

  render() {
    const { logined } = this.props;
    const inputCls = classnames(inputStyles.control, {
      [inputStyles.small]: Boolean(null)
    });
    const display = logined ? { display: 'none' } : {};
    return (
      <Layout className={styles.loginPage} style={display}>
        <Header className={styles.loginHeader}>
          <div className={styles.logo}>
            {/* <img src={logo} alt="logo" /> */}
          </div>
          <div className={styles.locale} />
        </Header>
        <Layout.Content className={styles.loginContent}>
          <div className={styles.formContainer}>
            <div className={styles.inner}>
              <LoginForm {...this.props} onSubmit={this.handleSubmit} />
              <div className={styles.desc}>
                <div className={styles.info}>
                  <div className={styles.infoLogo}>
                    <img src={logo} alt="logo" />
                  </div>
                  <div className={styles.welcome}>欢迎使用LEAN-ETL</div>
                  <div className={styles.infoIcon}>
                    <img src={infoIcon} alt="icon" />
                  </div>
                </div>
                <div className={styles.descBg} />
              </div>
            </div>
          </div>
        </Layout.Content>
        <Footer className={styles.loginFooter}>
          <center>苏州峰之鼎信息科技有限公司 Copyright &copy; 2017 - 2018 . All Rights Reserved.</center>
        </Footer>
      </Layout>
    );
  }
}

Login.propTypes = {
  logined: PropTypes.bool,
  pushState: PropTypes.func,
  checkLogin: PropTypes.func,
};

const mapStateToProps = state => ({
  logined: _get(state, 'login.logined', false)
});

export default connect(mapStateToProps, { checkLogin, pushState: push })(Login);
