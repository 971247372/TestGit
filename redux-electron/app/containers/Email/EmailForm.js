import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Checkbox, Button } from 'antd';

const Form = require('antd').Form;

class EmailForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      testVisible: false,
    };
  }

  onChange = value => {
    // /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    console.log('....value...', value);
  }

  onTest = e => {
    console.log(e.target.checked);
    this.setState({ testVisible: !!e.target.checked });
  }

  handleSave = () => {
    this.handleSubmit(this.props.onSave);
  }

  handleTest = () => {
    this.handleSubmit(this.props.onTest);
  }

  handleSubmit = func => {
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        func(values);
      }
    });
  }

  handleCheckEmailRule = (rule, value, callback) => {
    let err;
    value.forEach(v => {
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v)) {
        err = new Error('请填写正确的邮箱!');
        return false;
      }
    });
    callback(err);
  }

  render() {
    const { form, data = {} } = this.props;
    const { testVisible } = this.state;
    return (
      <Form onSubmit={this.handleSave}>
        <Form.Item label="发送服务器" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('smtp', {
            initialValue: data.smtp || '',
            rules: [{ required: true, message: '请输入发送服务器' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="端口" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('port', {
            initialValue: data.port || '',
            rules: [{ required: true, message: '请输入端口' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="账号" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('uname', {
            initialValue: data.uname || '',
            rules: [{ required: true, message: '请输入账号' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="密码" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('password', {
            initialValue: data.password || '',
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="收件人列表" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('recipientList', {
            initialValue: data.recipientList || [],
            rules: [{ validator: this.handleCheckEmailRule }]
          })(
            <Select mode="tags" />
          )}
          <Checkbox style={{ position: 'absolute', right: '-100px' }} onChange={this.onTest}>测试发送</Checkbox>
        </Form.Item>
        {testVisible && <Form.Item label="测试收件邮箱" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('testRecipient', {
            rules: [{
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '请填写正确的邮箱!'
            }]
          })(
            <Input />
          )}
          <Button style={{ position: 'absolute', right: '-85px' }} onClick={this.handleTest}>发送</Button>
        </Form.Item>}
        <Form.Item label="  " colon={false} labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          <Button type="primary" htmlType="submit">保存</Button>
        </Form.Item>
      </Form>
    );
  }
}

EmailForm.propTypes = {
  data: PropTypes.object,
  form: PropTypes.object,
  onTest: PropTypes.func,
  onSave: PropTypes.func,
};

export default Form.create()(EmailForm);
