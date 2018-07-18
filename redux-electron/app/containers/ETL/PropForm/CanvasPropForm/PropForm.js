import React, { PropTypes } from 'react';
import { Input, InputNumber, Radio, Select } from 'antd';
import { get as _get, uniq, isEmpty } from 'lodash';
import * as Props from '../defaultProps';

const Form = require('antd').Form;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const PropForm = ({ form: { getFieldDecorator }, data, type, mapper }) => {
  const mapperTableKeys = Object.keys(mapper.tables);
  const tabKey = mapperTableKeys.find(k => mapper.tables[k].type == 'target');
  const targetTable = mapper.tables[tabKey];
  if (isEmpty(targetTable)) {
    return null;
  }

  const portKeys = Object.keys(mapper.ports);
  const linkedPortKeys = portKeys.filter(k => mapper.ports[k].linked);
  // 已经被连接的所有源表 Key
  const sourceTableKeys = uniq(
    linkedPortKeys
      .map(k => {
        // 表被删除了，Port不会被删除，所以要过滤一下不存在的表
        if (_get(mapper.tables[mapper.ports[k].tableId], 'type', '') == 'source') {
          return mapper.ports[k].tableId;
        }
        return undefined;
      })
      .filter(k => k)
  );

  const keys = Object.keys(Props[type]);
  const formItems = keys.map((k, i) => {
    const prop = Props[type][k];
    let component;
    const valuePropName = 'value';
    const initialValue = data[prop.ref] || prop.defaultValue;
    switch (prop.component) {
      case 'inputNumber':
        component = <InputNumber placeholder={prop.placeholder || ''} />;
        break;
      case 'radio':
        component = (
          <RadioGroup>
            {prop.values.map((v, idx) => (
              <Radio value={v} key={idx}>
                {v}
              </Radio>
            ))}
          </RadioGroup>
        );
        break;
      case 'dropdown':
        if (prop.target && data[prop.target] != prop.targetValue) {
          break;
        }
        if (prop.values) {
          component = (
            <Select>
              {prop.values.map((v, idx) => (
                <Option value={v} key={idx}>
                  {v}
                </Option>
              ))}
            </Select>
          );
        } else if (prop.source) {
          component = (
            <Select allowClear>
              {sourceTableKeys.map(stk => {
                const sTable = mapper.tables[stk];
                return sTable.ports.map((spk, idx) => (
                  <Option value={`${sTable.name}.${mapper.ports[spk].columnName}`} key={idx}>
                    {`${sTable.name}.${mapper.ports[spk].columnName}`}
                  </Option>
                  ));
              })}
            </Select>
          );
        } else {
          component = (
            <Select allowClear>
              {targetTable.ports.map((colKey, idx) => (
                <Option value={mapper.ports[colKey].columnName} key={idx}>
                  {mapper.ports[colKey].columnName}
                </Option>
                ))}
            </Select>
          );
        }
        break;
      default:
        component = <Input placeholder={prop.placeholder || ''} />;
        break;
    }

    return !component ? (
      undefined
    ) : (
      <Form.Item label={prop.label} key={i}>
        {getFieldDecorator(prop.ref, { initialValue, valuePropName })(component)}
      </Form.Item>
    );
  });

  return (
    <Form>
      <Form.Item label="目标表">{targetTable.name}</Form.Item>
      {sourceTableKeys.length > 0 && (
        <Form.Item label="源表">
          {sourceTableKeys.map((k, i) => <div key={i}>{mapper.tables[k].name}</div>)}
        </Form.Item>
      )}
      {formItems}
    </Form>
  );
};

PropForm.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  mapper: PropTypes.object,
  type: PropTypes.string
};

const onValuesChange = (props, options) => {
  props.onChange(options);
};

export default Form.create({ onValuesChange })(PropForm);
