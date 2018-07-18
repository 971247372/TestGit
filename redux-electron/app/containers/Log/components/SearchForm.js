import React, { Component, PropTypes } from 'react';
import { Button, Select, Input, DatePicker } from 'antd';
import moment from 'moment';

const Form = require('antd').Form;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      startTime: '',
      endTime: '',
      jobName: ''
    };
  }

  onChange = (date, dateString) => {
    this.setState({
      startTime: dateString[0] ? moment(dateString[0]).format('YYYY-MM-DD HH:mm:ss') : dateString[0],
      endTime: dateString[1] ? moment(dateString[1]).format('YYYY-MM-DD HH:mm:ss') : dateString[1]
      // startTime: dateString[0] ? moment(dateString[0]).format('x') : dateString[0],
      // endTime: dateString[1] ? moment(dateString[1]).format('x') : dateString[1]
    });
  }

  onStatusChange = value => {
    this.setState({ status: value == 'ALL' ? '' : value });
  }

  onJobName = e => {
    this.setState({ jobName: e.target.value });
  }

  onSearch = () => {
    const { onSearch } = this.props;
    const { status, startTime, endTime, jobName } = this.state;
    if (onSearch) {
      onSearch({ status, startTime, endTime, jobName });
    }
  }

  render() {
    return (
      <Form layout="inline" style={{ paddingBottom: 24 }}>
        <FormItem label="状态">
          <Select style={{ width: 100 }} onChange={this.onStatusChange} defaultValue="ALL">
            <Option value="ALL">全部</Option>
            <Option value="FAILED">失败</Option>
            <Option value="SUCCESS">成功</Option>
            <Option value="RUNNING">执行中</Option>
            <Option value="WAIT">待执行</Option>
          </Select>
        </FormItem>
        <FormItem label="时间">
          <RangePicker onChange={this.onChange} />
        </FormItem>
        <FormItem label="名称">
          <Input onChange={this.onJobName} />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.onSearch}>查询</Button>
        </FormItem>
      </Form>
    );
  }
}

SearchForm.propTypes = {
  onSearch: PropTypes.func,
};

export default SearchForm;
