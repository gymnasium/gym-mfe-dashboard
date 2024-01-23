const path = require('path');
const { createConfig } = require('@edx/frontend-build');
const CopyPlugin = require('copy-webpack-plugin');

const config = createConfig('webpack-dev');

config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules',
];

config.resolve.alias = {
  '@edx/frontend-component-footer': path.resolve(__dirname, '../frontend-component-footer/src'),
  '@edx/frontend-component-header': path.resolve(__dirname, '../frontend-component-header/src'),
};

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