module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  // plugin:prettier/recommended
  plugins: ['import', 'react-hooks', 'react', 'jsx-a11y'],
  // 'prettier/prettier'
  rules: {
    // 'prettier/prettier': ['error', {usePrettierrc: true}],
    // "jsx-a11y/alt-text": [
    //   "warn",
    //   {
    //     "elements": [
    //       "img"
    //     ],
    //     "img": [
    //       "Image"
    //     ]
    //   }
    // ],
    'object-curly-spacing': ['error', 'never'],
    'no-undef': [0],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: ['TemplateLiteral'],
      },
    ],
    semi: [2, 'never'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
      },
    ],
    'jsx-quotes': [2, 'prefer-double'],
    'max-len': ['error', 150],
    'no-case-declarations': [0],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/prop-types': [0],
    'react/display-name': [0],
  },
  env: {
    browser: true,
    es6: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx'],
      parserOptions: {},
    },
  ],
  settings: {
    // 'import/resolver': {
    //   webpack: {
    //     config: './src/config/webpack.base.js',
    //   },
    // },
  },
}
