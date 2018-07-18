import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Input, Button, notification } from 'antd';

import styles from './style.scss';
import inputStyles from './Input.scss';
import userIcon from './user.png';
import passIcon from './pass.png';
import capIcon from './captcha.png';

const Form = require('antd').Form;
const FormItem = Form.Item;
// const { session: { login } } = actions;

class LoginForm extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.refs.input.focus();
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.username == 'admin' && values.password == '123' && this.props.onSubmit) {
          this.props.onSubmit();
        } else {
          notification.warning({
            message: '用户名或密码错误'
          });
        }
      }
    });
  };

  renderInput = (name, msg, input, icon, captcha = null) => {
    const { form: { getFieldDecorator } } = this.props;
    const inputCls = classnames(inputStyles.control, {
      [inputStyles.small]: Boolean(captcha)
    });
    return (
      <div className={inputStyles.wrapper}>
        <img className={inputStyles.icon} src={icon} alt="name" />
        <div className={inputCls}>
          {getFieldDecorator(name, {
            rules: [{ required: true, message: msg }]
          })(input)}
        </div>
        {captcha && <div className={inputStyles.captcha}>{captcha}</div>}
      </div>
    );
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className={styles.form}>
        <div className={styles.formTitle}>登录</div>
        <FormItem>
          {this.renderInput(
            'username',
            '请填写用户名',
            <Input
              placeholder="请填写用户名"
              ref={node => (this.input = node)}
            />,
            userIcon
          )}
        </FormItem>
        <FormItem>
          {this.renderInput(
            'password',
            '请填写密码',
            <Input
              type="password"
              placeholder="请填写密码"
            />,
            passIcon
          )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" size="large" className={styles.btn}>登录</Button>
        </FormItem>
      </Form>
    );
  }
}

LoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

export default connect(null)(withRouter(Form.create()(LoginForm)));
