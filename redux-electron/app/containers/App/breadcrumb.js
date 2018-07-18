import { HashRouter as Router, Route, Switch, Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import React from 'react';

const routes = [
  {
    path: 'process',
    breadcrumbName: '首页'
  },
  {
    path: 'log',
    breadcrumbName: '一级面包屑'
  },
  {
    path: 'job',
    breadcrumbName: '当前页面'
  }
];
export default class MyBreadcrumb extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
    );
  };
  render() {
    return <Breadcrumb itemRender={this.itemRender} routes={this.routes} />;
  }
}
