import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Collapse, Spin, Icon } from 'antd';
import { get as _get } from 'lodash';
import TableList from './TableList';
import styles from './style.scss';
import actions from '../../../reducers/datasource/actions';

const Panel = Collapse.Panel;
const { datasource: { getDatasourceTables, getDatasourceTablesByDsId } } = actions;

class DsCollapse extends Component {
  onChange = key => {
    if (!key) return;
    const { selectDsList } = this.props;
    const ds = selectDsList[key];
    const { dsTables, getDatasourceTables, getDatasourceTablesByDsId } = this.props;
    // if (!dsTables[ds.id]) {
    if (ds.id) {
      // getDatasourceTables(id);
      getDatasourceTablesByDsId(ds.id);
    }
  };

  onRemoveDs = (e, ds) => {
    e.preventDefault();
    e.stopPropagation();
    const { onRemoveDs } = this.props;
    if (onRemoveDs) {
      onRemoveDs(ds);
    }
  };

  renderHeader = ds => (
    <div>
      <span>{ds.dsType == 'target' ? '目标数据源' : '源数据源'} {ds.name || ds.type}</span>
      <Icon
        type="close-circle"
        className={styles['ds-close']}
        onClick={e => this.onRemoveDs(e, ds)}
      />
    </div>
  );

  renderContent = selectDsList => {
    const { dsLoading, onGenerateView, onDynamicEdit, handleDynamicDelete } = this.props;
    return Object.keys(selectDsList).map(k => {
      const ds = selectDsList[k];
      return (
        <Panel header={this.renderHeader(ds)} key={k}>
          <Spin spinning={dsLoading} size="small">
            <TableList id={ds.id} dsType={ds.dsType} onGenerateView={onGenerateView} onDynamicEdit={onDynamicEdit} handleDynamicDelete={handleDynamicDelete} />
          </Spin>
        </Panel>
      );
    });
  };

  render() {
    return (
      <Collapse accordion bordered={false} onChange={this.onChange}>
        {this.renderContent(this.props.selectDsList)}
      </Collapse>
    );
  }
}

DsCollapse.propTypes = {
  dsTables: PropTypes.object,
  selectDsList: PropTypes.object,
  dsLoading: PropTypes.bool,
  onRemoveDs: PropTypes.func,
  onGenerateView: PropTypes.func,
  getDatasourceTables: PropTypes.func,
  getDatasourceTablesByDsId: PropTypes.func,
  onDynamicEdit: PropTypes.func,
  handleDynamicDelete: PropTypes.func,
};

const mapStateToProps = state => ({
  dsTables: _get(state, 'datasource.tables', {}),
  dsLoading: _get(state, 'datasource.dsLoading', true)
});

export default connect(mapStateToProps, { getDatasourceTables, getDatasourceTablesByDsId })(DsCollapse);
