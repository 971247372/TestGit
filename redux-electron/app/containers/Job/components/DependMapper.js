import React from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import { generate as getId } from 'shortid';
import styles from '../style.scss';

const Option = Select.Option;

class DependMapper extends React.PureComponent {
  onChange = idx => value => {
    const list = [...this.props.value];
    list[idx] = value;
    this.props.onChange(list);
  };

  appendDepend = () => {
    this.props.onChange([...this.props.value, '']);
  };

  removeDependMapper = idx => () => {
    const list = [...this.props.value];
    list.splice(idx, 1);
    this.props.onChange(list);
  };

  renderDependMapper = idx => {
    const { etlList = [], value } = this.props;
    return (
      <div>
        <Select style={{ width: 180 }} onChange={this.onChange(idx)} defaultValue={value[idx]}>
          {etlList.map(etl => etl.available && <Option key={etl.id} value={etl.id}>{etl.name}</Option>)}
        </Select>
        <Icon
          type="delete"
          className={styles.dependMapperDelete}
          onClick={this.removeDependMapper(idx)}
        />
      </div>
    );
  };

  render() {
    const { value = [] } = this.props;
    return (
      <div>
        {value.map((dm, idx) => <div key={getId()}>{this.renderDependMapper(idx)}</div>)}
        <Icon
          type="plus-circle-o"
          style={{ color: '#108ee9', cursor: 'pointer' }}
          onClick={this.appendDepend}
        />
      </div>
    );
  }
}

DependMapper.propTypes = {
  value: PropTypes.array,
  etlList: PropTypes.array,
  onChange: PropTypes.func
};

export default DependMapper;
