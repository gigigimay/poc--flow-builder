module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    'dynamic-import-node',
    'add-module-exports',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          'lodash/fp': '@appman/mac_modules/fp',
        },
      },
    ],
  ],
  ignore: ['node_modules'].concat(
    process.env.NODE_ENV === 'production' ? ['**/*.test.js', '__mocks__'] : []
  ),
  sourceMap: 'inline',
  retainLines: true,
}
