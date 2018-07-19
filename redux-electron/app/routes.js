/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Route, Switch, Redirect, IndexRoute } from 'react-router';
import { Login } from './containers';

export default () => (
  <div>
    <Route path="/" component={Login} />
  </div>
);
