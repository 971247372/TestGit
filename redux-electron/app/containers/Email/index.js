import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import { Input, Select, Card, notification } from 'antd';
import EmailForm from './EmailForm';
import actions from '../../reducers/email/actions';

const { email: { sendTestMail, saveMail, loadMail } } = actions;

class Email extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      visible: false,
      step: 0
    };
  }

  componentDidMount() {
    this.props.loadMail();
  }

  onTest = data => {
    this.props.sendTestMail(data, {
      success: () => {
        notification.success({
          message: '邮件发送成功'
        });
      },
      fail: err => {
        notification.error({
          message: '邮件发送失败',
          description: err.message || ''
        });
      }
    });
  }

  onSave = data => {
    this.props.saveMail(data, {
      success: () => {
        notification.success({
          message: '保存成功'
        });
      },
      fail: err => {
        notification.error({
          message: '保存失败',
          description: err.message || ''
        });
      }
    });
  }

  render() {
    const { mailData } = this.props;
    return (
      <Card title="邮箱配置">
        <EmailForm onSave={this.onSave} onTest={this.onTest} data={mailData} />
      </Card>
    );
  }
}

Email.propTypes = {
  // logList: PropTypes.array,
  // loading: PropTypes.bool,
  // count: PropTypes.number,
  mailData: PropTypes.object,
  loadMail: PropTypes.func,
  saveMail: PropTypes.func,
  sendTestMail: PropTypes.func,
  // loadJobLogList: PropTypes.func
};

const mapStateToProps = state => ({
  mailData: _get(state, 'email.data', {}),
  // count: _get(state, 'log.total', 0),
  // loading: _get(state, 'log.loading', true)
});

export default connect(mapStateToProps, { sendTestMail, saveMail, loadMail })(Email);
