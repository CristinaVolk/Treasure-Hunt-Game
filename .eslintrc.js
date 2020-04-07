module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['import'],
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "import/first": "error",
    'no-continue': 'off',
    'array-callback-return': 'off',
    'class-methods-use-this': 'off',
    'react/prop-types': 0,
    'no-param-reassign': [2, { props: false }],
    'no-useless-constructor': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    semi: 'off',
    quotes: ['warn', 'single', 'avoid-escape'],
    'no-console': [ 'warn', { allow: [ 'warn' ] } ],
    "@typescript-eslint/no-use-before-define": "warn"
  },
};
