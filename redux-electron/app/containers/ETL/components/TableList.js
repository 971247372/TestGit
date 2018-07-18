import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get as _get, isEqual } from 'lodash';
import { Input, Collapse, Tooltip, Icon } from 'antd';
import Item from './Item';
import styles from './style.scss';

const Search = Input.Search;
const Panel = Collapse.Panel;

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableList: this.props.tables
    };
  }

  componentWillMount() {
    this.state = {
      tableList: this.props.tables
    };
  }

  componentWillReceiveProps(nextProp) {
    if (!isEqual(this.props.tables, nextProp.tables)) {
      this.state = {
        tableList: nextProp.tables
      };
    }
  }

  onSearch = type => e => {
    this.setState({
      tableList: {
        ...this.state.tableList,
        [type]: this.props.tables[type].filter(t => t.toLowerCase().includes(e.target.value))
      }
    });
  };

  onGenerateView = () => {
    const { id, onGenerateView } = this.props;
    if (onGenerateView) {
      onGenerateView(id);
    }
  };

  suffix = (dsId, tableName) => (
    <span>
      <Tooltip title="编辑">
        <Icon type="edit" className={styles.viewEdit} onClick={this.props.onDynamicEdit(dsId, tableName)} />
      </Tooltip>
      <Tooltip title="删除">
        <Icon type="delete" className={styles.viewDelete} onClick={this.props.handleDynamicDelete(dsId, tableName)} />
      </Tooltip>
    </span>
  );

  renderSuffix = () => {};

  render() {
    const { tableList } = this.state;
    const { id, dsType } = this.props;

    // const suffix = (dsId, tableName) => (
    //   <Tooltip title="编辑">
    //     <Icon type="edit" className={styles.viewEdit} onClick={onDynamicEdit(dsId, tableName)} />
    //   </Tooltip>
    // );

    return (
      <div>
        <Collapse accordion bordered={false}>
          <Panel header="实体表">
            <Search placeholder="快速搜索" onChange={this.onSearch('staticTables')} />
            {tableList.staticTables &&
              tableList.staticTables.map((name, idx) => (
                <Item key={idx} name={name} tableType="static" type={dsType} dsId={id} />
              ))}
          </Panel>
        </Collapse>
        {dsType == 'source' && (
          <Collapse accordion bordered={false}>
            <Panel header="自定义SQL" className={styles.dropDown}>
              <Search placeholder="快速搜索" onChange={this.onSearch('dynamicTables')} />
              {tableList.dynamicTables &&
                tableList.dynamicTables.map((name, idx) => (
                  <Item
                    key={idx}
                    name={name}
                    tableType="dynamic"
                    type={dsType}
                    dsId={id}
                    suffix={this.suffix(id, name)}
                  />
                ))}
              <Icon type="plus-circle-o" className={styles.addView} onClick={this.onGenerateView} />
            </Panel>
          </Collapse>
        )}
      </div>
    );
  }
}

TableList.propTypes = {
  id: PropTypes.string,
  dsType: PropTypes.string,
  tables: PropTypes.object,
  onGenerateView: PropTypes.func,
  onDynamicEdit: PropTypes.func,
  handleDynamicDelete: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  tables: _get(state, ['datasource', 'tables', props.id], {})
});

export default connect(mapStateToProps)(TableList);
