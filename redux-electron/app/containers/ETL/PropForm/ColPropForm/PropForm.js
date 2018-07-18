import React, { PropTypes } from 'react';
import { Input, InputNumber, Select } from 'antd';
import * as Props from '../defaultProps';

const Form = require('antd').Form;
const Option = Select.Option;

const PropForm = ({ form: { getFieldDecorator }, data, type }) => {
  let columnProps = Props[type].source;
  if (data.target) {
    // 该Column为目标Column
    columnProps = Props[type].target;
  }

  
  const keys = Object.keys(columnProps);
  const formItems = keys.map((k, i) => {
    const prop = columnProps[k];
    let component;
    const valuePropName = 'value';
    const initialValue = data[prop.ref] || prop.defaultValue || '';
    switch (prop.component) {
      case 'inputNumber':
        component = <InputNumber placeholder={prop.placeholder || ''} />;
        break;
      case 'dropdown':
        component = (
          <Select>
            {prop.values.map((v, idx) => <Option value={v} key={idx}>{v}</Option>)}
          </Select>
        );
        break;
      default:
        component = <Input placeholder={prop.placeholder || ''} />;
        break;
    }
    return (
      <Form.Item label={prop.label} key={i}>
        {getFieldDecorator(prop.ref, { initialValue, valuePropName })(component)}
      </Form.Item>
    );
  });
  return (
    <Form>
      <Form.Item label="字段名">{data.columnName}</Form.Item>
      <Form.Item label="数据类型">{data.columnType}</Form.Item>
      {formItems}
    </Form>
  );
};

PropForm.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  type: PropTypes.string
};

const onValuesChange = (props, options) => {
  props.onChange(options);
};

export default Form.create({ onValuesChange })(PropForm);
