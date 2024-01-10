const path = require('path');
const { createConfig } = require('@edx/frontend-build');
const CopyPlugin = require('copy-webpack-plugin');

const config = createConfig('webpack-prod');

config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules',
  path.resolve(__dirname, './node_modules'),
  path.resolve(__dirname, '../frontend-component-header/src'),
  path.resolve(__dirname, '../frontend-component-footer/src'),
  path.resolve(__dirname, '../brand-openedx/src'),
];

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

config.plugins.push(
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, './public/robots.txt'),
        to: path.resolve(__dirname, './dist/robots.txt'),
      },
    ],
  }),
);

module.exports = config;
