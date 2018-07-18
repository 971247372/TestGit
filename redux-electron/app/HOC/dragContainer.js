import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEmpty } from 'lodash';
import { DropTarget } from 'react-dnd';
import { Modal, notification } from 'antd';
import { generate as getId } from 'shortid';
import { EtlNodeModel, EtlPortModel } from '../components';

const confirm = Modal.confirm;

function wrapper(WrapperComponent, diagramEngine, diagramModel) {
  const nodesTarget = {
    drop(props, monitor, component) {
      const { x: pageX, y: pageY } = monitor.getSourceClientOffset();
      const { left = 0, top = 0 } = diagramEngine.canvas.getBoundingClientRect();
      const { offsetX, offsetY } = diagramEngine.diagramModel;
      const x = pageX - left - offsetX;
      const y = pageY - top - offsetY;
      
      // 新增表 创建table ID
      const tableId = getId();
      const item = monitor.getItem();
      
      const mapper = JSON.parse(JSON.stringify(props.mapper)); // 获取当前Mapper

      const TARGET = 'target';
      const SOURCE = 'source';
      const tableKeys = Object.keys(mapper.tables);

      // 查看是否存在目标表，唯一
      const existTargetTable = tableKeys.find(
        key => mapper.tables[key].type == TARGET
      );

      if (!isEmpty(existTargetTable) && item.type == TARGET) {
        notification.warning({
          message: '目标表已添加'
        });
        return;
      }

      if (tableKeys.find(k => mapper.tables[k].dsId == item.dsId && mapper.tables[k].name == item.name)) {
        notification.warning({
          message: '该表已存在'
        });
        return;
      }

      // 创建 table node
      const node = new EtlNodeModel(tableId, item.name, item.dsId, item.type, {
        onRemove: nodeId => {
          const removeTable = mapper.tables[nodeId];
          const removePorts = removeTable.ports;
          const links = mapper.links;
          const lks = Object.keys(links);
          lks.forEach(k => {
            // 检查所有和被删除表有关的线
            if (removePorts.includes(mapper.links[k].sourcePort)) {
              // 如果线的源头Port连接被删除表, 那么就找到该线的目标Port
              const rtp = mapper.ports[mapper.links[k].targetPort];

              // 检查目标表Port是否被多表连接
              const checkTargetPortLinked = Object.keys(mapper.links).filter(lk => mapper.links[lk].targetPort == mapper.links[k].targetPort);

              // 如果目标表的Port仅被删除表连接，删除选中状态，否则不删除，别的源表还要连接
              if (checkTargetPortLinked.length == 1) {
                // 从Model里找到目标Port， 将其选中状态修改为 false
                diagramModel.nodes[rtp.tableId].ports[rtp.columnName].selected = false;
                // 并且将目标Port连接状态删除
                delete rtp.linked;
              }

              // // 从Model里找到目标Port， 将其选中状态修改为 false
              // diagramModel.nodes[rtp.tableId].ports[rtp.columnName].selected = false;
              // // 并且将目标Port连接状态删除
              // delete rtp.linked;
              // 删除该线
              delete mapper.links[k];
            } else if (removePorts.includes(mapper.links[k].targetPort)) {
              // 如果线的目标Port连接被删除表, 那么就找到该线的源Port
              const rsp = mapper.ports[mapper.links[k].sourcePort];
              // 从Model里找到源Port， 将其选中状态修改为 false
              diagramModel.nodes[rsp.tableId].ports[rsp.columnName].selected = false;
              // 并且将源Port连接状态删除
              delete rsp.linked;
              // 删除该线
              delete mapper.links[k];
            }
          });
          // 删除表
          delete mapper.tables[nodeId];
          diagramEngine.diagramModel.nodes[nodeId].remove();
          // removeNode.remove();
          diagramEngine.forceUpdate();
          props.updateMapper(mapper);
        }
      }, true);

      node.x = x;
      node.y = y;
      diagramModel.addNode(node);

      const postResponse = type => data => {
        const ports = {};
        data.columns.forEach(col => {
          const colId = getId();
          node.addPort(
            new EtlPortModel({
              id: colId,
              name: col.columnName,
              type: col.columnType
            })
          );

          ports[colId] = {
            ...col,
            tableId
          };
        });

        const _node = cloneDeep(node);
        _node.isLoading = false;
        // _node.sourceTableType = type;
        diagramModel.nodes[tableId] = _node;
        diagramEngine.forceUpdate();

        // 初始化 mapper table
        const table = {
          [tableId]: {
            type: item.type,
            name: item.name,
            dsId: item.dsId,
            sourceTableType: type,
            ports: [...Object.keys(ports)],
            x,
            y
          }
        };
        props.updateMapper({
          ...mapper,
          ports: {
            ...mapper.ports,
            ...ports
          },
          tables: {
            ...mapper.tables,
            ...table
          }
        });
      };

      if (item.tableType == 'static') {
        // 构建Columns
        props.getDatasourceTableColumns(item.dsId, item.name, {
          success: postResponse('NORMAL')
        });
      } else {
        // dynamic
        props.getDatasourceDynamicTableColumns(item.dsId, item.name, {
          success: postResponse('DYNAMIC')
        });
      }

      // // 查看是否存在目标表，唯一
      // const existTargetTable = tableKeys.filter(
      //   key => mapper.tables[key].type == TARGET
      // );

      // if (existTargetTable.length == 0) {
      //   component.showConfirm(() => {
      //     node.type = TARGET;
      //     // 重置该表为目标表
      //     props.updateMapper({ [tableId]: { ...mapper.tables[tableId], type: TARGET } });

      //     // 修改model中node样式
      //     const _node = cloneDeep(diagramModel.nodes[tableId]);
      //     _node.type = TARGET;
      //     diagramModel.nodes[tableId] = _node;
      //     diagramEngine.forceUpdate();
      //   });
      // }
    }
  };

  class DragWrapperContainer extends React.Component {
    static propTypes = {
      connectDropTarget: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this.state = {
        visible: false
      };
    }

    showConfirm = onOk => {
      confirm({
        title: '是否将该表设为目标表?',
        onOk,
        onCancel() {}
      });
    };

    render() {
      const { connectDropTarget } = this.props;
      return connectDropTarget(
        <div>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
          <WrapperComponent {...this.props} />
        </div>
      );
    }
  }
  return DropTarget('node-source', nodesTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }))(DragWrapperContainer);
}

export default wrapper;
