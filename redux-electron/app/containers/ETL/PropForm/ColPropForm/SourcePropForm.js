import React, { PropTypes } from 'react';
import { get as _get } from 'lodash';
import { Input, InputNumber, Select, Radio } from 'antd';
import * as Props from '../defaultProps';

const Form = require('antd').Form;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const SourcePropForm = ({ form: { getFieldDecorator }, mapper, data, type, onChange }) => {
  let columnProps = Props[type].source;
  if (data.target) {
    // 该Column为目标Column
    columnProps = Props[type].target;
  }

  const keys = Object.keys(columnProps);
  const formItems = keys.map((k, i) => {
    const prop = columnProps[k];
    let component;
    let initialValue = data[prop.ref] || prop.defaultValue || '';
    switch (prop.component) {
      case 'inputNumber':
        component = <InputNumber placeholder={prop.placeholder || ''} />;
        break;
      case 'radio':
        initialValue = data.defaultSelectPort;
        component = (
          <RadioGroup
            value={initialValue}
            onChange={e => onChange(e.target.value, 'defaultSelectPort')}
          >
            {data[prop.ref].map((portKey, idx) => (
              <Radio value={portKey} key={idx}>
                {mapper.ports[portKey].columnName}
              </Radio>
            ))}
          </RadioGroup>
        );
        break;
      case 'dropdown':
        component = (
          <Select>
            {prop.values.map((v, idx) => (
              <Option value={v} key={idx}>
                {v}
              </Option>
            ))}
          </Select>
        );
        break;
      default:
        initialValue = _get(data, 'options', {})[data.defaultSelectPort] || '';
        component = (
          <Input
            placeholder={prop.placeholder || ''}
            value={initialValue}
            onChange={e => onChange(e.target.value, 'sourceColumnName')}
          />
        );
        break;
    }
    return (
      <Form.Item label={prop.label} key={i}>
        {component}
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

SourcePropForm.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  mapper: PropTypes.object,
  type: PropTypes.string,
  onChange: PropTypes.func
};

export default Form.create()(SourcePropForm);
