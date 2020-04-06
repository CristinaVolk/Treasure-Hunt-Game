module.exports = {
  settings: {
    react: {
      version: "detect",
    },
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-base",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:react/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true,
  },
  rules: {
    "no-continue": "off",
    "array-callback-return":'off',
    "class-methods-use-this": 'off',
    "react/prop-types": 0,
    "no-param-reassign": [ 2, { "props": false } ],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-useless-constructor": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    semi: ["warn", "never"],
    quotes: [ "warn", "single", "avoid-escape" ],
    "no-console":"off"
  },
}
