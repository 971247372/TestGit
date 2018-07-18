const { injectBabelPlugin, compose } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireMobX = require('react-app-rewire-mobx');
const rewireEslint = require('react-app-rewire-eslint');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireVendorSplitting = require('react-app-rewire-vendor-splitting');
const path = require('path');
const theme = require('./theme');

const appSrc = path.resolve('./src');

const rewires = compose(rewireMobX, rewireEslint, rewireVendorSplitting, rewireStyledComponents);

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    config
  );
  if (env === 'production') {
    config = injectBabelPlugin(['transform-remove-console', { exclude: ['error'] }], config);
  }
  config = rewireLess.withLoaderOptions({
    modifyVars: theme
  })(config, env);
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '~': appSrc
    }
  };
  // console.log(config);
  return rewires(config, env);
};
