module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
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
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'require-yield': 'off',
    indent: ['error', 2, { SwitchCase: 1 }]
  }
};