import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get as _get } from 'lodash';
import { Tabs, Button } from 'antd';
import actions from '../../../../reducers/etl/actions';
import PropForm from './PropForm';
import styles from '../style.scss';

const TabPane = Tabs.TabPane;
const { etl: { saveMapperProp } } = actions;

class ColPropForm extends Component {
  constructor(props) {
    super(props);
    const { current, data } = this.props;
    this.state = {
      id: current.id,
      options: {
        ...data
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { current, data } = nextProps;
    this.setState({
      id: current.id,
      options: {
        ...data
      }
    });
  }

  handleColumnChange = options => {
    this.setState({ options: { ...this.state.options, ...options } });
  };

  handleSaveProps = e => {
    e.preventDefault();
    const { mapper } = this.props;
    const mapperTableKeys = Object.keys(mapper.tables);
    const targetTableKey = mapperTableKeys.filter(k => mapper.tables[k].type == 'target');
    const targetTableName = _get(mapper.tables[targetTableKey], 'name', []);

    const { current } = this.props;
    const { options } = this.state;
    const opt = {
      ...options,
      targetTableName,
      backType: options.backType || 'FILE',
      targetTableKey: options.targetTableRadio == '新增' ? undefined : options.targetTableKey
    };
    this.props.saveMapperProp(current.id, current.type, opt);
  }

  render() {
    const { current, mapper } = this.props;
    const { options } = this.state;

    return (
      <div className={styles['etl-prop']}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="属性设置" key="1">
            <PropForm type={current.type} data={options} mapper={mapper} onChange={this.handleColumnChange} />
          </TabPane>
        </Tabs>
        <div className={styles.save}>
          <Button type="primary" className={styles.btn} onClick={this.handleSaveProps}>
            完成后点击保存
          </Button>
        </div>
      </div>
    );
  }
}

ColPropForm.propTypes = {
  current: PropTypes.object,
  data: PropTypes.object,
  mapper: PropTypes.object,
  saveMapperProp: PropTypes.func
};

const mapStateToProps = state => ({
  // current: _get(state, 'etl.current', {}),
  // mapper: selectCurrentMapper(state)
});

export default withRouter(connect(mapStateToProps, { saveMapperProp })(ColPropForm));
