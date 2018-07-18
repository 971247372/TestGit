import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

export default class TransferTable extends React.PureComponent {
  static propTypes = {
    rowKey: PropTypes.string,
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    scroll: PropTypes.object
  };

  renderHeader = () => {
    const { columns } = this.props;
    return columns.map((col, idx) => <th key={`th-${idx}`}>{col.title}</th>);
  }

  renderBody = () => {
    const { columns, dataSource, rowKey } = this.props;
    const draw = (data, col, idx) => {
      if (col.render) {
        return <td key={`td-${data[rowKey]}-${idx}`}>{col.render(data)}</td>;
      }
      return <td key={`td-${data[rowKey]}-${idx}`}>{data[col.key]}</td>;
    };

    return dataSource.map(data => (
      <tr key={`tbody-${data[rowKey]}`} className={styles.colRow}>
        {columns.map((col, idx) => draw(data, col, idx))}
      </tr>
    ));
  }

  render() {
    const { scroll } = this.props;
    const style = scroll ? { maxHeight: scroll.y, overflowY: 'auto' } : {};
    return (
      <div style={style}>
        <table cellPadding="0" cellSpacing="0" className={styles.colTable}>
          <thead><tr>{this.renderHeader()}</tr></thead>
          <tbody>{this.renderBody()}</tbody>
        </table>
      </div>
    );
  }
}
