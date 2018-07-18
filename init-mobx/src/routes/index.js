import React from 'react';
// import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CTX } from '~/config';
import App from '~/routes/App';
import SignPage from '~/routes/Sign';

const Routes = () => (
  <Router basename={CTX}>
    <Switch>
      {/* 登录页 */}
      <Route exact path="/:sign(login|register|logout)" component={SignPage} />
      <Switch>
        {/* 首页 */}
        <Route exact path="/" component={App} />
      </Switch>
    </Switch>
  </Router>
);

Routes.propTypes = {};

export default Routes;
