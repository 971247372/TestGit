import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Steps, notification } from 'antd';
import { generate as getId } from 'shortid';
import DsForm from './DsForm';
import Transfer from './Transfer';

const Step = Steps.Step;

class AutoTarget extends Component {
  static defaultProps = {
    fieldList: [],
    funcList: []
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      cols: [],
      fieldList: [],
      targetFieldList: [],
      visible: false,
      step: 0,
      dsType: {}
    };
  }

  onSubmit = () => {
    // this.gotoStep(1)();
    const { validateFields } = this.dsForm;
    const { dsList, fieldList } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const ds = dsList.find(ds => ds.id == values.targetDsId);
        this.setState({
          dsType: {
            ...this.state.dsType,
            targetDsId: values.targetDsId,
            targetTableName: values.targetTableName.trim(),
            targetDsType: ds ? ds.type : null
          }
        });
        fieldList(ds.type, {
          success: data => {
            this.setState({ fieldList: data });
          }
        });
        this.gotoStep(1)();
      }
    });
  };

  onQueryTextChange = value => {
    this.setState({
      value
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  onTableNameChange = e => {
    this.setState({
      dsType: {
        ...this.state.dsType,
        targetTableName: e.target.value.trim()
      }
    });
  };

  onTransferChange = data => {
    this.setState({ targetFieldList: data });
  }

  onGenerateTable = () => {
    const { dsType } = this.state;
    const { onGenerateTable, autoTargetFunc } = this.props;
    const data = {
      name: dsType.targetTableName,
      type: dsType.targetDsType,
      columns: this.transfer.state.colData.map(d => ({
        columnName: d.columnName,
        columnType: d.columnType,
        datasize: d.datasize,
        nullable: d.nullable,
        sourceColName: d.sourceColName
      }))
    };

    autoTargetFunc(dsType.targetDsId, data, {
      success: () => {
        notification.success({
          message: '创建成功'
        });
        onGenerateTable(this.buildTargetNodeAndJoin({
          ...data,
          sourceTableName: dsType.sourceTableName,
          dsId: dsType.targetDsId
        }));
        this.setState({ visible: false });
      },
      fail: err => {
        notification.error({
          message: '创建失败',
          description: err.message || err.error_message
        });
      }
    });
  };

  buildTargetNodeAndJoin = data => {
    const { mapper } = this.props;
    const tableId = getId();

    // 获取Mapper中源表
    const sourceTableId = Object.keys(mapper.tables).find(k => mapper.tables[k].name == data.sourceTableName);
    // 获取源表字段
    const sourcePorts = {};
    mapper.tables[sourceTableId].ports.forEach(p => {
      // ({ ...mapper.ports[p], id: p })
      sourcePorts[p] = { ...mapper.ports[p] };
    });

    // 构建目标字段
    const links = {};
    const ports = {};
    const portKeys = data.columns.map(col => {
      const id = getId();
      const sourcePortId = Object.keys(sourcePorts).find(spk => sourcePorts[spk].columnName == col.sourceColName);
      ports[id] = {
        ...col,
        tableId,
        linkPorts: [sourcePortId],
        linked: true
      };

      // 构建连接线
      links[getId()] = {
        sourcePort: sourcePortId,
        targetPort: id
      };

      // 修改源表字段被连接
      sourcePorts[sourcePortId] = {
        ...sourcePorts[sourcePortId],
        linkPorts: [id],
        linked: true
      };
      return id;
    });

    // 构建目标Table
    const table = {
      [tableId]: {
        dsId: data.dsId,
        name: data.name,
        ports: portKeys,
        sourceTableType: 'NORMAL',
        type: 'target',
        x: mapper.tables[sourceTableId].x + 300,
        y: mapper.tables[sourceTableId].y
      }
    };

    return { table, ports: { ...ports, ...sourcePorts }, links };
  }

  gotoStep = step => () => {
    this.setState({ step });
  };

  openModal = (cols, ds, tableName) => {
    this.setState({
      visible: true,
      dsType: {
        ...this.state.dsType,
        sourceDsId: ds.id,
        sourceTableName: tableName,
        sourceDsType: ds.type
      },
      cols
    });
  };

  closeModal = () => {
    this.setState({
      visible: false
    });
  };

  renderStep = () => {
    const { step } = this.state;
    return (
      <div style={{ padding: '20px 0' }}>
        <Steps size="small" current={step}>
          <Step title="设置目标表数据源类型" />
          <Step title="选取目标表字段" />
        </Steps>
      </div>
    );
  };

  renderFoot = () => {
    const { step } = this.state;
    switch (step) {
      case 0:
        return (
          <Button type="primary" onClick={this.onSubmit}>
            下一步
          </Button>
        );
      case 1:
        return (
          <div>
            <Button onClick={this.gotoStep(0)}>返回</Button>
            <Button type="primary" onClick={this.onGenerateTable}>
              生成目标表
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    const { dsList, fieldMapping, fieldMappingAll } = this.props;
    const { fieldList, cols, visible, step, dsType } = this.state;
    return (
      <Modal
        visible={visible}
        onCancel={this.closeModal}
        width={720}
        height={430}
        footer={this.renderFoot()}
        maskClosable={false}
      >
        {this.renderStep()}
        {step == 0 && <DsForm ref={node => (this.dsForm = node)} data={dsType} dsList={dsList} />}
        {step == 1 && (
          <Transfer
            ref={node => (this.transfer = node)}
            sourceData={cols}
            dsType={dsType}
            fieldMapping={fieldMapping}
            fieldMappingAll={fieldMappingAll}
            fieldList={fieldList}
            onTransferChange={this.onTransferChange}
            onTableNameChange={this.onTableNameChange}
          />
        )}
      </Modal>
    );
  }
}

AutoTarget.propTypes = {
  onChange: PropTypes.func,
  onGenerateTable: PropTypes.func,
  fieldList: PropTypes.func,
  autoTargetFunc: PropTypes.func,
  fieldMapping: PropTypes.func,
  fieldMappingAll: PropTypes.func,
  dsList: PropTypes.array,
  mapper: PropTypes.object,
};

export default AutoTarget;
