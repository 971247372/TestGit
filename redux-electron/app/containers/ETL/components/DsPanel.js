import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get as _get, cloneDeep, isEmpty } from 'lodash';
import { Card, Popover, Icon } from 'antd';
import { selectCurrentMapper } from '../../../reducers/etl/selector';
import actions from '../../../reducers/datasource/actions';
import etlActions from '../../../reducers/etl/actions';
import DsCollapse from './DsCollapse';
import styles from './style.scss';

const { datasource: { loadDatasourceList } } = actions;
const { etl: { updateMapper } } = etlActions;

class DsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTrack: false,
      selectDsList: props.mapper.datasource || {},
      targetDs: isEmpty(_get(props, 'mapper.datasource.target', {})),
      sourceDs: isEmpty(_get(props, 'mapper.datasource.source', {}))
    };
  }

  componentDidMount() {
    this.state = {
      isTrack: false,
      selectDsList: this.props.mapper.datasource || {},
      targetDs: isEmpty(_get(this.props, 'mapper.datasource.target', {})),
      sourceDs: isEmpty(_get(this.props, 'mapper.datasource.source', {}))
    };
    this.props.loadDatasourceList();
  }

  onContrack = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isTrack: !this.state.isTrack });
  };

  onDsChoose = (e, ds, dsType) => {
    e.preventDefault();
    e.stopPropagation();
    const { mapper, updateMapper } = this.props;
    this.setState({
      selectDsList: {
        ...this.state.selectDsList,
        [dsType]: {
          ...ds,
          dsType
        }
      },
      [`${dsType}Ds`]: false
    });
    const mds = {
      ...mapper.datasource,
      [dsType]: {
        ...ds,
        dsType
      }
    };
    updateMapper({
      ...mapper,
      datasource: {
        ...mds
      }
    });
  };

  onRemoveDs = ds => {
    const { selectDsList } = this.state;
    const { mapper, updateMapper } = this.props;
    const dsObj = cloneDeep(selectDsList);
    if (selectDsList[ds.dsType]) {
      delete dsObj[ds.dsType];
      this.setState({
        selectDsList: dsObj,
        [`${ds.dsType}Ds`]: true
      });
    }

    const newMapper = cloneDeep(mapper);
    // 所有和被删除DS有关系的表
    const removeTableKeys = Object.keys(mapper.tables).filter(k => mapper.tables[k].type == ds.dsType);
    if (newMapper.datasource[ds.dsType]) {
      delete newMapper.datasource[ds.dsType];

      // 删除所有连接线，因为不管什么数据源删除，所有相关数据表都会被删除，目标表只有一个，所以所有的线肯定会被删除
      newMapper.links = {};
      this.props.mapper.links = {};
      
      removeTableKeys.forEach(k => {
        const t = newMapper.tables[k];
        // 删除所有有关的Prot
        t.ports.forEach(pk => {
          delete newMapper.ports[pk];
        });
        // 删除表
        delete newMapper.tables[k];
      });

      updateMapper(newMapper);
    }
  };

  renderPopContent = dsType => {
    const { dsList } = this.props;
    return dsList.map(ds => (
      <div
        key={ds.id}
        className={styles['ds-pop-content']}
        onClick={e => this.onDsChoose(e, ds, dsType)}
      >
        {ds.name || ds.type}
      </div>
    ));
  };

  render() {
    const { selectDsList, isTrack, targetDs, sourceDs } = this.state;
    const { onGenerateView, onDynamicEdit, handleDynamicDelete } = this.props;
    return (
      <div>
        <div className={styles['track-right']} onClick={this.onContrack}>
          <Icon type="double-right" style={{ margin: '10px' }} />
        </div>
        <Card
          title="数据源"
          className={`${styles['etl-collapse']} ${isTrack ? styles.hide : styles.show}`}
          extra={
            <a onClick={this.onContrack}>
              <Icon type="double-left" />
            </a>
          }
        >
          <DsCollapse selectDsList={selectDsList} onRemoveDs={this.onRemoveDs} onGenerateView={onGenerateView} onDynamicEdit={onDynamicEdit} handleDynamicDelete={handleDynamicDelete} />
          {sourceDs && (
            <Popover
              content={this.renderPopContent('source')}
              placement="right"
              trigger="click"
              overlayClassName={styles['ds-pop']}
            >
              <div className={styles['ds-source-plus']}>
                <div className={styles['ds-plus-block']}>
                  <Icon type="plus" />
                  <div>添加源数据源</div>
                </div>
              </div>
            </Popover>
          )}
          {targetDs && (
            <Popover
              content={this.renderPopContent('target')}
              placement="right"
              trigger="click"
              overlayClassName={styles['ds-pop']}
            >
              <div className={styles['ds-target-plus']}>
                <div className={styles['ds-plus-block']}>
                  <Icon type="plus" />
                  <div>添加目标数据源</div>
                </div>
              </div>
            </Popover>
          )}
        </Card>
      </div>
    );
  }
}

DsPanel.propTypes = {
  dsList: PropTypes.array,
  mapper: PropTypes.object,
  updateMapper: PropTypes.func,
  loadDatasourceList: PropTypes.func,
  onGenerateView: PropTypes.func,
  onDynamicEdit: PropTypes.func,
  handleDynamicDelete: PropTypes.func,
};

const mapStateToProps = state => ({
  dsList: _get(state, 'datasource.list', []),
  dsTables: _get(state, 'datasource.tables', {}),
  dsLoading: _get(state, 'datasource.dsLoading', true),
  mapper: selectCurrentMapper(state)
});

export default connect(mapStateToProps, { loadDatasourceList, updateMapper })(DsPanel);
