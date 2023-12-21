const path = require('path'),
  runWebpack = require('./lib/webpack-wrapper')

test('Tracks a shared synchronous webpack split', async () => {
  const result = (await runWebpack({
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 0,
      }
    },
    entry: {
      'imports1': path.resolve(__dirname, './fixtures/imports1.es6.js'),
      'imports2': path.resolve(__dirname, './fixtures/imports2.es6.js'),
    },
  })).result

  expect(result).toEqual({
    imports1: { js: { 'imports1.js': {} } },
    imports2: { js: { 'imports2.js': {} } },
  })
})
