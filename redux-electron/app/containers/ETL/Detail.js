import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button, Input, Modal, notification } from 'antd';
import { generate as getId } from 'shortid';
import { get as _get, isEmpty, cloneDeep } from 'lodash';
import actions from '../../reducers/etl/actions';
import dsActions from '../../reducers/datasource/actions';
import { selectCurrentMapper } from '../../reducers/etl/selector';
import { LitBreadcrumb } from '../../components';
import DsPanel from './components/DsPanel';
import Diagram from './components/Diagram';
import PropForm from './PropForm';
import Preview from './Preview';
import AutoTarget from './AutoTarget';
import styles from './style.scss';

const {
  etl: {
    addMapper,
    saveMapper,
    savePutMapper,
    loadEtl,
    updateMapper,
    dynamicTable,
    updateDynamicTable,
    deleteDynamicTable,
    dynamicTablePreview,
    fieldMapping,
    fieldMappingAll,
    fieldList,
    autoTarget
  }
} = actions;

const {
  datasource: { getDatasourceDynamicTableColumns }
} = dsActions;

class Detail extends Component {
  constructor(props) {
    super(props);
    const isexsis = !!props.match.params.id;
    this.state = {
      visible: false,
      previewVisible: false,
      add: !isexsis
    };
  }

  componentWillMount() {
    const { id, addMapper, loadEtl } = this.props;
    if (!id) {
      addMapper();
    } else {
      loadEtl(id);
    }
  }

  onSave = e => {
    e.preventDefault();
    const { id, mapper } = this.props;
    // console.log('mmmmmmmmmmmmmmm');
    // console.log(this.props);

    const tks = Object.keys(mapper.tables);
    if (isEmpty(mapper.tables)) {
      notification.warning({
        message: '未添加源表或目标表'
      });
      return;
    }
    const sk = tks.find(k => mapper.tables[k].type == 'source');
    const tk = tks.find(k => mapper.tables[k].type == 'target');
    if (!sk || !tk) {
      notification.warning({
        message: '未添加源表或目标表'
      });
      return;
    }

    const mapperOptions = _get(mapper, 'options', {});
    if (!mapperOptions.name) {
      notification.warning({
        message: '请填写ETL名称'
      });
      return;
    }

    if (
      mapperOptions.targetTableRadio == '新增并更新' &&
      !mapperOptions.targetTableKey
    ) {
      notification.warning({
        message: '请选择目标表主键'
      });
      return;
    }
    if (this.state.add) {
      this.props.saveMapper(id, {
        success: () => {
          notification.success({
            message: id ? '修改成功' : '保存成功'
          });
        },
        fail: err => {
          notification.error({
            message: '创建失败',
            description: err.message || err.error_message
          });
        }
      });
    } else {
      this.props.savePutMapper(id, {
        success: () => {
          notification.success({
            message: id ? '修改成功' : '保存成功'
          });
        },
        fail: err => {
          notification.error({
            message: '创建失败',
            description: err.message || err.error_message
          });
        }
      });
    }
  };

  onDragTable = mapper => {
    this.setState({ mapper });
  };

  onGenerateView = dsId => {
    this.preview.openModal(dsId);
  };

  onPreview = (dsId, value) => {
    this.props.dynamicTablePreview(dsId, value);
  };

  onDynamicEdit = (dsId, tableName) => e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.getDatasourceDynamicTableColumns(dsId, tableName, {
      success: data => {
        const { columns, ...dynamicTable } = data;
        this.preview.openModal(dsId, dynamicTable.type ? dynamicTable : {});
      }
    });
  };

  handleOpenModal = () => {
    const { mapper, current, dsColumns } = this.props;
    if (current.type != 'table') {
      return;
    }

    const t = _get(mapper, ['tables', current.id], {});
    if (t.type != 'source') {
      return;
    }
    const cols = _get(dsColumns, t.name, []);
    if (cols.length == 0) {
      return;
    }
    const targetTable = Object.keys(mapper.tables).find(
      k => mapper.tables[k].type == 'target'
    );
    if (targetTable) {
      notification.warning({
        message: '已存在目标表'
      });
      return;
    }

    this.autoTarget.openModal(
      cols.map(c => ({
        ...c,
        id: getId()
      })),
      mapper.datasource.source,
      t.name
    );
  };

  handleGenerateTable = data => {
    const { mapper, updateMapper } = this.props;
    updateMapper({
      ...mapper,
      ports: {
        ...mapper.ports,
        ...data.ports
      },
      tables: {
        ...mapper.tables,
        ...data.table
      },
      links: {
        ...mapper.links,
        ...data.links
      }
    });
  };

  handleDynamicDelete = (dsId, tableName) => e => {
    e.preventDefault();
    e.stopPropagation();
    const { deleteDynamicTable } = this.props;
    Modal.confirm({
      title: `确认要删除[ ${tableName} ]?`,
      onOk() {
        deleteDynamicTable(dsId, tableName, {
          success: () => {
            notification.success({
              message: '删除成功'
            });
          },
          fail: err => {
            notification.error({
              message: '删除失败',
              description: err.message || err.err_message || ''
            });
          }
        });
      }
    });
  };

  render() {
    const {
      id,
      mapperLoading,
      mapper,
      dsList,
      fieldMapping,
      fieldMappingAll,
      fieldList,
      autoTarget,
      dynamicTable,
      updateDynamicTable,
      dynamicTablePreview
    } = this.props;
    const breadcrumbItems = [
      { icon: 'fa-file-text-o', url: '/etl', name: '映射管理' },
      {
        icon: 'fa-file-text-o',
        name: `${id ? _get(mapper, 'options.name', id) : '新建映射'}`
      }
    ];
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          {!mapperLoading && (
            <DsPanel
              mapper={mapper}
              onDragTable={this.onDragTable}
              onGenerateView={this.onGenerateView}
              onDynamicEdit={this.onDynamicEdit}
              handleDynamicDelete={this.handleDynamicDelete}
            />
          )}
          {!mapperLoading && <Diagram id={id} mapper={mapper} />}
          {!mapperLoading && <PropForm mapper={mapper} />}
          <div style={{ height: 41, background: '#fff', zIndex: 999 }}>
            <div style={{ lineHeight: '41px', float: 'left', marginLeft: 5 }}>
              <LitBreadcrumb items={breadcrumbItems} />
            </div>
            <div
              style={{
                height: 41,
                lineHeight: '41px',
                marginRight: 5,
                float: 'right'
              }}
            >
              <Button onClick={this.handleOpenModal} style={{ marginRight: 5 }}>
                生成目标表
              </Button>
              <Button type="primary" icon="save" onClick={this.onSave}>
                保存
              </Button>
            </div>
          </div>
          <Preview
            key={getId()}
            ref={node => (this.preview = node)}
            onPreview={dynamicTablePreview}
            onGenerate={dynamicTable}
            handleUpdate={updateDynamicTable}
          />
          <AutoTarget
            key={getId()}
            ref={node => (this.autoTarget = node)}
            dsList={dsList}
            mapper={mapper}
            fieldList={fieldList}
            fieldMapping={fieldMapping}
            fieldMappingAll={fieldMappingAll}
            autoTargetFunc={autoTarget}
            onGenerateTable={this.handleGenerateTable}
          />
          {/* <ul className={styles['etl-menus']}>
            <li onClick={this.onSave}>
              <Icon type="save" />
              <span>保存</span>
            </li>
          </ul> */}
        </div>
      </DragDropContextProvider>
    );
  }
}

Detail.propTypes = {
  id: PropTypes.string,
  mapperLoading: PropTypes.bool,
  mapper: PropTypes.object,
  current: PropTypes.object,
  dsColumns: PropTypes.object,
  dsList: PropTypes.array,
  loadEtl: PropTypes.func,
  addMapper: PropTypes.func,
  updateMapper: PropTypes.func,
  autoTarget: PropTypes.func,
  fieldList: PropTypes.func,
  saveMapper: PropTypes.func,
  fieldMapping: PropTypes.func,
  fieldMappingAll: PropTypes.func,
  dynamicTable: PropTypes.func,
  updateDynamicTable: PropTypes.func,
  deleteDynamicTable: PropTypes.func,
  savePutMapper: PropTypes.func,
  dynamicTablePreview: PropTypes.func,
  getDatasourceDynamicTableColumns: PropTypes.func
};

const mapStateToProps = (state, props) => ({
  id: props.match.params.id,
  mapperLoading: _get(state, 'etl.mapperLoading', true),
  dsList: _get(state, 'datasource.list', []),
  dsColumns: _get(state, 'datasource.columns', {}),
  current: _get(state, 'etl.current', {}),
  // mapper: _get(state, 'etl.mapper', {})
  mapper: selectCurrentMapper(state)
});

export default connect(
  mapStateToProps,
  {
    addMapper,
    saveMapper,
    savePutMapper,
    loadEtl,
    updateMapper,
    dynamicTable,
    updateDynamicTable,
    deleteDynamicTable,
    dynamicTablePreview,
    fieldMapping,
    fieldMappingAll,
    fieldList,
    autoTarget,
    getDatasourceDynamicTableColumns
  }
)(Detail);
