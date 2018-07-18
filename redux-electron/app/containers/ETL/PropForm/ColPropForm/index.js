import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get as _get } from 'lodash';
import { Tabs, Button } from 'antd';
import actions from '../../../../reducers/etl/actions';
import PropForm from './PropForm';
import SourcePropForm from './SourcePropForm';
import styles from '../style.scss';

const TabPane = Tabs.TabPane;
const { etl: { saveMapperProp } } = actions;

class ColPropForm extends Component {
  constructor(props) {
    super(props);
    const { current, data } = this.props;
    const _data = data.target ? {
      ...data,
      script: data.script || '',
      transformer: data.transformer || 'COPY',
      defaultSelectPort: data.linkPorts[0]
    } : {
      ...data,
      defaultSelectPort: data.linkPorts[0]
    };
    this.state = {
      id: current.id,
      data: _data
    };
  }

  componentWillReceiveProps(nextProps) {
    const { current, data } = nextProps;
    const _data = data.target ? {
      ...data,
      script: data.script || '',
      transformer: data.transformer || 'COPY',
      defaultSelectPort: data.linkPorts[0]
    } : {
      ...data,
      defaultSelectPort: data.linkPorts[0]
    };
    this.state = {
      id: current.id,
      data: _data
    };
  }

  handleColumnChange = options => {
    this.setState({
      data: {
        ...this.state.data,
        ...options
      }
    });
  };

  handleSourceChange = (value, key) => {
    const { data } = this.state;
    const defaultSelectPort = key == 'defaultSelectPort' ? value : data.defaultSelectPort;
    const opt = data.options || {};
    // const opt = _get(data, ['options', defaultSelectPort], {});
    this.setState({
      data: {
        ...data,
        defaultSelectPort,
        options: {
          ...data.options,
          [defaultSelectPort]: key == 'sourceColumnName' ? value : opt[defaultSelectPort] || ''
        }
      }
    });
  };

  handleSaveProps = e => {
    e.preventDefault();

    const { current } = this.props;
    const { data } = this.state;

    const _data = data.target ? { ...data, transformer: data.transformer || 'COPY' } : data;

    this.props.saveMapperProp(current.id, current.type, _data);
  };

  render() {
    const { current, mapper } = this.props;
    const { data } = this.state;

    return (
      <div className={styles['etl-prop']}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="属性设置" key="1">
            {!data.target && (
              <SourcePropForm
                type={current.type}
                data={data}
                mapper={mapper}
                onChange={this.handleSourceChange}
              />
            )}
            {data.target && (
              <PropForm
                type={current.type}
                data={data}
                mapper={mapper}
                onChange={this.handleColumnChange}
              />
            )}
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
  mapper: PropTypes.object,
  data: PropTypes.object,
  saveMapperProp: PropTypes.func
};

const mapStateToProps = state => ({
  // current: _get(state, 'etl.current', {}),
  // mapper: selectCurrentMapper(state),
  dsLoading: _get(state, 'datasource.dsLoading', true)
});

export default withRouter(connect(mapStateToProps, { saveMapperProp })(ColPropForm));
