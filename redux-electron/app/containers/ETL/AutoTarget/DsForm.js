import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';

const Form = require('antd').Form;
const Option = Select.Option;

class DsForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      visible: false,
      step: 0
    };
  }

  render() {
    const { form, data, dsList } = this.props;
    return (
      <Form>
        <Form.Item label="选择目标表数据源类型" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('targetDsId', {
            initialValue: data.targetDsId || '',
            rules: [{ required: true, message: '请选择数据源' }]
          })(
            <Select>
              {dsList.map(ds => <Option key={ds.id} value={ds.id}>{ds.name || ds.type}</Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="目标表名称" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('targetTableName', {
            initialValue: data.targetTableName || '',
            rules: [{ required: true, message: '请输入目标表名称' }]
          })(
            <Input />
          )}
        </Form.Item>
      </Form>
    );
  }
}

DsForm.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  dsList: PropTypes.array
};

export default Form.create()(DsForm);
