import React, { PropTypes } from 'react';
import { get as _get } from 'lodash';
import { Input, InputNumber, Select } from 'antd';

const Form = require('antd').Form;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

const ConfigForm = ({ form: { getFieldDecorator }, data }) => {
  return (
    <Form>
      <Form.Item {...formItemLayout} label="连接地址">
        {getFieldDecorator('host', {
          initialValue: _get(data, 'host', ''),
          rules: [{ required: true, message: '请输入连接地址!' }]
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="端口号">
        {getFieldDecorator('port', {
          initialValue: _get(data, 'port', ''),
          rules: [{ required: true, message: '请输入端口号!' }]
        })(<Input />)}
      </Form.Item>
    </Form>
  );
};

ConfigForm.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object
};

const onValuesChange = (props, options) => {
  props.onChange(options);
};

export default Form.create({ onValuesChange })(ConfigForm);
