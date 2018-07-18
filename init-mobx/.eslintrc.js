const path = require('path');
const appSrc = path.resolve('./src');

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true
  },
  plugins: ['react', 'jsx-a11y'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'class-methods-use-this': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'consistent-return': 'off',
    eqeqeq: 'off',
    'func-names': 'off',
    'global-require': 'off',
    'import/imports-first': 'off',
    'import/newline-after-import': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'error',
    'import/no-webpack-loader-syntax': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/media-has-caption': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/heading-has-content': 'off',
    'jsx-a11y/label-has-for': 'error',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'max-len': 'off',
    'newline-per-chained-call': 'off',
    'no-bitwise': 'off',
    'no-confusing-arrow': 'off',
    'no-console': 'off',
    'no-else-return': 'off',
    'no-mixed-operators': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-shadow': 'off',
    'no-trailing-spaces': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'off',
    'object-shorthand': 'warn',
    'prefer-template': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-no-target-blank': 'off',
    'react/no-array-index-key': 'off',
    'react/no-danger': 'off',
    'react/no-did-mount-set-state': 'off',
    'react/no-find-dom-node': 'off',
    'react/prefer-stateless-function': 'off',
    'react/require-default-props': 'off',
    'react/require-extension': 'off',
    'react/self-closing-comp': 'off',
    'require-yield': 'off',
    indent: ['error', 2, { SwitchCase: 1 }]
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', appSrc],
        ],
        extensions: ['.js', '.jsx', '.json']
      }
    }
  }
};
