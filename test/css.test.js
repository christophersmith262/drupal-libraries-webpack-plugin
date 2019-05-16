const path = require('path'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  DrupalLibrariesPlugin = require('../').DrupalLibrariesPlugin,
  runWebpack = require('./lib/webpack-wrapper')

test('Adds css assets to libraries', async () => {
  const result = (await runWebpack({
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
    entry: {
      'css-include': path.resolve(__dirname, './fixtures/css-include.es6.js'),
    },
  }, null, [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ])).result

  expect(result).toEqual({
    'css-include': {
      version: '1.x',
      css: { theme: { 'css-include.css': {} } },
      js: { 'css-include.js': {} },
    },
  })
})
