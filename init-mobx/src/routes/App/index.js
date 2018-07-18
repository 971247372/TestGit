import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
@inject(({ session }) => ({
  sessionTest: session.sessionTest
}))
@observer
class index extends Component {
  render() {
    return <div>登录{this.props.sessionTest}</div>;
  }
}

index.propTypes = {
  sessionTest: PropTypes.string
};

export default index;
