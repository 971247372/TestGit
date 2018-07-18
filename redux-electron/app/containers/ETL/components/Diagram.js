import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get as _get, isEmpty, isEqual, cloneDeep } from 'lodash';
import { generate as getId } from 'shortid';
import * as SRD from 'react-js-diagrams/lib/main';
import { selectCurrentMapper } from '../../../reducers/etl/selector';
import { EtlNodeFactory, EtlLinkFactory, EtlNodeModel, EtlPortModel } from '../../../components';
import actions from '../../../reducers/etl/actions';
import dsActions from '../../../reducers/datasource/actions';
import { dragContainer } from '../../../HOC';

const { etl: { updateMapper, doSelect } } = actions;
const { datasource: { getDatasourceTableColumns, getDatasourceDynamicTableColumns } } = dsActions;

const engine = new SRD.DiagramEngine();
engine.registerNodeFactory(new EtlNodeFactory());
// engine.registerLinkFactory(new EtlLinkFactory());
engine.registerLinkFactory(new SRD.DefaultLinkFactory());
const model = new SRD.DiagramModel();

class Diagram extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    // 初始化面板
    model.link = {};
    model.links = {};
    model.nodes = {};

    this.state = {
      mapper: this.props.mapper
    };
  }

  componentWillMount() {
    this.state = {
      mapper: this.props.mapper
    };
    this.onLoad();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.mapper, nextProps.mapper)) {
      this.state = {
        mapper: nextProps.mapper
      };
      model.link = {};
      model.links = {};
      model.nodes = {};
      this.onLoad();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  onLoad = () => {
    const { id, updateMapper } = this.props;
    const { mapper } = this.state;
    // URL包含ID 为详情页
    // if (id) {
    // 创建Node
    if (!isEmpty(mapper.tables)) {
      const linkPort = {};
      const newMapper = cloneDeep(mapper);
      const tableKeys = Object.keys(newMapper.tables);
      tableKeys.forEach(key => {
        const table = newMapper.tables[key];
        const node = new EtlNodeModel(key, table.name, table.dsId, table.type, {
          onRemove: nodeId => {
            // const newMapper = cloneDeep(mapper);
            // 被删除的表
            const removeTable = newMapper.tables[nodeId];
            // 被删除表的Column
            const removePorts = removeTable.ports;
            const links = newMapper.links;
            const lks = Object.keys(links);
            lks.forEach(k => {
              // 检查所有和被删除表有关的线
              if (removePorts.includes(newMapper.links[k].sourcePort)) {
                // 如果线的源头Port连接被删除表, 那么就找到该线的目标Port
                const rtp = newMapper.ports[newMapper.links[k].targetPort];

                // 检查目标表Port是否被多表连接
                const checkTargetPortLinked = Object.keys(newMapper.links).filter(
                  lk => newMapper.links[lk].targetPort == newMapper.links[k].targetPort
                );

                // 如果目标表的Port仅被删除表连接，删除选中状态，否则不删除，别的源表还要连接
                if (checkTargetPortLinked.length == 1) {
                  // 从Model里找到目标Port， 将其选中状态修改为 false
                  model.nodes[rtp.tableId].ports[rtp.columnName].selected = false;
                  // 并且将目标Port连接状态删除
                  delete rtp.linked;
                }

                // // 从Model里找到目标Port， 将其选中状态修改为 false
                // model.nodes[rtp.tableId].ports[rtp.columnName].selected = false;
                // // 并且将目标Port连接状态删除
                // delete rtp.linked;
                // 删除该线
                delete newMapper.links[k];
              } else if (removePorts.includes(newMapper.links[k].targetPort)) {
                // 如果线的目标Port连接被删除表, 那么就找到该线的源Port
                const rsp = newMapper.ports[newMapper.links[k].sourcePort];
                // 从Model里找到源Port， 将其选中状态修改为 false
                model.nodes[rsp.tableId].ports[rsp.columnName].selected = false;
                // 并且将源Port连接状态删除
                delete rsp.linked;
                // 删除该线
                delete newMapper.links[k];
              }
            });
            // 删除表
            delete newMapper.tables[nodeId];
            engine.diagramModel.nodes[nodeId].remove();
            // removeNode.remove();
            engine.forceUpdate();
            updateMapper(newMapper);
          }
        });
        node.x = table.x;
        node.y = table.y;

        // 创建Port
        table.ports.forEach(pk => {
          const port = newMapper.ports[pk];
          const newPort = new EtlPortModel({
            id: pk,
            name: port.columnName,
            type: port.columnType
          });
          if (port.linked) {
            linkPort[pk] = newPort;
          }
          node.addPort(newPort);
        });
        model.addNode(node);
      });

      // 创建Link
      const linkKeys = Object.keys(newMapper.links);
      linkKeys.forEach(lk => {
        const link = new SRD.LinkModel();
        const sourcePortKey = newMapper.links[lk].sourcePort;
        const targetPortKey = newMapper.links[lk].targetPort;

        const sPort = linkPort[sourcePortKey];
        const tPort = linkPort[targetPortKey];
        sPort.selected = true;
        tPort.selected = true;
        link.setSourcePort(sPort);
        link.setTargetPort(tPort);
        model.addLink(link);
      });

      model.setOffset(mapper.x, mapper.y);
      engine.forceUpdate();
    }
    // }
  };

  onChange = (model, action) => {
    const { mapper } = this.props;
    // console.log('....model...', model);
    // console.log('....action...', action);
    if (action.type == 'link-connected') {
      // 连线操作
      const source = action.linkModel.sourcePort;
      const target = action.linkModel.targetPort;

      if (source.parentNode.id == target.parentNode.id) {
        this.props.doSelect({ id: source.id, type: 'column' });
        return; // 仅仅只是点了一下而已，啥都没干 或者 自己连自己
      }

      source.selected = true;
      target.selected = true;

      const linkId = getId();
      let link = {
        [linkId]: {
          sourcePort: source.id,
          targetPort: target.id
        }
      };

      let ports = {
        [source.id]: {
          ...mapper.ports[source.id],
          target: false,
          linked: true,
          linkPorts: mapper.ports[source.id].linkPorts
            ? mapper.ports[source.id].linkPorts.concat(target.id)
            : [target.id]
        },
        [target.id]: {
          ...mapper.ports[target.id],
          target: true,
          linked: true,
          linkPorts: mapper.ports[target.id].linkPorts
            ? mapper.ports[target.id].linkPorts.concat(source.id)
            : [source.id]
        }
      };

      if (source.parentNode.type == 'target') {
        // 从目标表 -连接- 到源表
        // 这时目标Node Port需要换过来存
        link = {
          [linkId]: {
            sourcePort: target.id,
            targetPort: source.id
          }
        };

        ports = {
          [source.id]: {
            ...mapper.ports[source.id],
            target: true,
            linked: true,
            linkPorts: mapper.ports[source.id].linkPorts
              ? mapper.ports[source.id].linkPorts.concat(target.id)
              : [target.id]
          },
          [target.id]: {
            ...mapper.ports[target.id],
            target: false,
            linked: true,
            linkPorts: mapper.ports[target.id].linkPorts
              ? mapper.ports[target.id].linkPorts.concat(source.id)
              : [source.id]
          }
        };
      }

      this.props.updateMapper({
        ...mapper,
        ports: {
          ...mapper.ports,
          ...ports
        },
        links: {
          ...mapper.links,
          ...link
        }
      });
    }

    if (action.type == 'node-moved') {
      // 移动表
      const table = {
        [action.model.id]: {
          ...mapper.tables[action.model.id],
          x: action.model.x,
          y: action.model.y
        }
      };
      this.props.updateMapper({
        ...mapper,
        tables: {
          ...mapper.tables,
          ...table
        }
      });
    }

    if (action.type == 'node-selected') {
      this.props.doSelect({ id: action.model.id, type: 'table' });
    }
    if (action.type == 'canvas-click') {
      this.props.doSelect({ id: '', type: 'canvas' });
    }
    if (action.type == 'canvas-drag') {
      this.props.updateMapper({
        ...mapper,
        x: model.offsetX,
        y: model.offsetY
      });
    }
  };

  render() {
    engine.setDiagramModel(model);
    return (
      <SRD.DiagramWidget
        diagramEngine={engine}
        onChange={this.onChange}
        actions={{ zoom: false }}
      />
    );
  }
}

Diagram.propTypes = {
  id: PropTypes.string,
  mapper: PropTypes.object,
  doSelect: PropTypes.func,
  updateMapper: PropTypes.func
  // getDatasourceTableColumns: PropTypes.func
};

const mapStateToProps = (state, props) => ({
  // mapperLoading: _get(state, 'etl.mapperLoading', true),
  // id: _get(props, 'match.params.id', undefined),
  mapper: selectCurrentMapper(state)
});

export default connect(mapStateToProps, {
  updateMapper,
  doSelect,
  getDatasourceTableColumns,
  getDatasourceDynamicTableColumns
})(dragContainer(Diagram, engine, model));
