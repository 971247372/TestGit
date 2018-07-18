import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

const Breadcrumb = require('antd').Breadcrumb;

class LitBreadcrumb extends Component {
  render() {
    const { items } = this.props;
    const renderItem = items.map((item, i) => {
      if (items.length - 1 == i) {
        return (
          <Breadcrumb.Item key={i}>
            <i className={`fa ${item.icon}`} style={{ marginRight: 4, marginLeft: 2 }} />
            <span to={item.url}>{item.name}</span>
          </Breadcrumb.Item>
        );
      }
      return (
        <Breadcrumb.Item key={i}>
          <i className={`fa ${item.icon}`} style={{ marginRight: 4, marginLeft: 2 }} />
          <Link to={item.url}>{item.name}</Link>
        </Breadcrumb.Item>
      );
    });
    return (
      <Breadcrumb>
        {renderItem}
      </Breadcrumb>
    );
  }
}

LitBreadcrumb.propTypes = {
  items: PropTypes.array
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(LitBreadcrumb);
