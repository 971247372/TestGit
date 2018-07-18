import React, { PropTypes } from 'react';

export default class PortWidget extends React.Component {
  static propTypes = {
    node: PropTypes.object,
    selected: PropTypes.bool,
    name: PropTypes.string,
    align: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected || false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state = {
      selected: nextProps.selected || false
    };
  }

  render() {
    const { name, align, node } = this.props;
    
    return (
      <div
        className={`port${this.state.selected ? ' selected' : ''}`}
        onMouseEnter={() => this.setState({ selected: true })}
        onMouseLeave={() => this.setState({ selected: this.props.selected || false })}
        style={{ float: align }}
        data-name={name}
        data-nodeid={node.getID()}
      />
    );
  }
}
