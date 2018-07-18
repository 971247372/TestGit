import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

function wrapper(WrapperedComponent, style = {}) {
  const nodeSource = {
    beginDrag(props) {
      return props;
    }
  };
  
  class DragWrapperComponent extends React.Component {
    static propTypes = {
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
    };

    render() {
      const { isDragging, connectDragSource } = this.props;
      const opacity = isDragging ? 0.4 : 1;

      return connectDragSource(<div style={{ ...style, opacity }}><WrapperedComponent {...this.props} /></div>);
    }
  }
  return DragSource('node-source', nodeSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(DragWrapperComponent);
}

export default wrapper;
