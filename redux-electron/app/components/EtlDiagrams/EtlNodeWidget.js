import React, { PropTypes } from 'react';
import { get as _get } from 'lodash';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import EtlPortWidget from './EtlPortWidget';

class EtlNodeWidget extends React.Component {
  static propTypes = {
    dsList: PropTypes.array,
    node: PropTypes.object,
    // diagramEngine: PropTypes.object,
  };

  onRemove = () => {
    const { node } = this.props;
    const actions = _get(node, 'actions', {});
    if (actions.onRemove) {
      actions.onRemove(node.id);
    }
    // node.remove();
    // diagramEngine.forceUpdate();
  }

  onTitleSelect = node => {
    const onSelectTable = _get(node, 'actions.onSelectTable');
    if (onSelectTable) {
      onSelectTable(node);
    }
  }

  render() {
    const { node, dsList } = this.props;
    const ports = node.getPorts();
    const dsName = _get(dsList.find(ds => ds.id == node.dsId), 'name', '');
    return (
      <Spin spinning={node.isLoading}>
        <div className={`basic-node ${node.type}-bg`}>
          <div className={`title ${node.type}`}>
            <div className="name" onClick={this.onTitleSelect(node)}>
              {node.type == 'target' && (
                <ul>
                  <li style={{ float: 'left' }}>
                    <i className="lean-etl lean-etl-daoru" style={{ fontSize: 22, marginRight: 5 }} />
                  </li>
                  <li style={{ float: 'left' }}>
                    <div>目标表 {dsName}</div>
                    <span>{node.name}</span>
                  </li>
                </ul>
              )}
              {node.type == 'source' && (
                <ul>
                  <li style={{ float: 'left' }}>
                    <i className="lean-etl lean-etl-daochu" style={{ fontSize: 22, marginRight: 5 }} />
                  </li>
                  <li style={{ float: 'left' }}>
                    <div>源表 {dsName}</div>
                    <span>{node.name}</span>
                  </li>
                </ul>
              )}
              {/* <span>{node.name}</span> */}
            </div>
            <div className="fa fa-close" onClick={this.onRemove} />
          </div>
          <div className="ports">
            {Object.keys(ports).map((key, idx) => <EtlPortWidget model={ports[key]} key={`port-${idx}`} />)}
          </div>
          {/* <div style={{ position: 'relative' }}>
            <div style={{ postion: 'absolute', zIndex: 10, left: 0 }}></div>
            <div style={{ postion: 'absolute', zIndex: 10, right: 0 }}></div>
          </div> */}
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  dsList: _get(state, 'datasource.list', [])
});

export default connect(mapStateToProps)(EtlNodeWidget);
