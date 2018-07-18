import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Radio, notification } from 'antd';
import { generate as getId } from 'shortid';
import DependMapper from './DependMapper';
import styles from '../style.scss';

const Form = require('antd').Form;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class DetailForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dependType: '',
      dependMapperList: []
    };
  }

  onChange = e => {
    this.setState({ dependType: e.target.value });
  };

  render() {
    const { form, etlList } = this.props;
    const { dependType, dependMapperList } = this.state;
    return (
      <Form>
        <Form.Item label="任务名称" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入任务名称' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="依赖映射" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('taskId', {
            rules: [{ required: true, message: '请选择依赖映射' }]
          })(
            <Select>
              {etlList.map(
                etl =>
                  etl.available && (
                    <Option key={etl.id} value={etl.id}>
                      {etl.name}
                    </Option>
                  )
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="定时器cron" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('cronExpressions', {
            rules: [{ required: true, message: '请输入定时器cron' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="任务描述" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('description')(<Input />)}
        </Form.Item>
        <Form.Item label="映射类型" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
          {form.getFieldDecorator('dependType', { initialValue: 'single' })(
            <RadioGroup onChange={this.onChange}>
              <Radio value="single">独立</Radio>
              <Radio value="join">依赖</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        {dependType == 'join' && (
          <Form.Item label="依赖关系" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
            {form.getFieldDecorator('dependedMapperIds', { initialValue: dependMapperList || [] })(
              <DependMapper etlList={etlList} />
            )}
          </Form.Item>
        )}
      </Form>
    );
  }
}

DetailForm.propTypes = {
  form: PropTypes.object,
  etlList: PropTypes.array
};

export default Form.create()(DetailForm);
