/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Route, Switch, Redirect, IndexRoute } from 'react-router';
import {
  App,
  Datasource,
  Job,
  ETL,
  ETLDetail,
  Log,
  Login,
  Email
} from './containers';

export default () => (
  <div>
    <Route path="/" component={Login} />
    <App>
      <Switch>
        <Route path="/etl/create" component={ETLDetail} />
        <Route path="/etl/detail/:id" component={ETLDetail} />
        <Route path="/etl" component={ETL} />
        <Route path="/job" component={Job} />
        <Route path="/log" component={Log} />
        <Route path="/email" component={Email} />
        {/* <Route path="/log/:id" component={Log} /> */}
        <Route path="/ds" component={Datasource} />
      </Switch>
    </App>
  </div>
);
