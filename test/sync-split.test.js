const path = require('path'),
  runWebpack = require('./lib/webpack-wrapper')

test('Tracks a shared synchronous webpack split', async () => {
  const result = (await runWebpack({
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 1,
            minSize: 0,
          }
        }
      }
    },
    entry: {
      'requires1': path.resolve(__dirname, './fixtures/requires1.es6.js'),
      'requires2': path.resolve(__dirname, './fixtures/requires2.es6.js'),
    },
  })).result

  expect(result).toEqual({
    requires1: { version: '1.x', js: { 'requires1.js': {} }, dependencies: ['commons'] },
    requires2: { version: '1.x', js: { 'requires2.js': {} }, dependencies: ['commons'] },
    commons: { version: '1.x', js: { 'commons.js': {} } },
  })
})

test('Tracks a shared synchronous webpack split using importfrom', async () => {
  const result = (await runWebpack({
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 1,
            minSize: 0,
          }
        }
      }
    },
    entry: {
      'importsfrom1': path.resolve(__dirname, './fixtures/importsfrom1.es6.js'),
      'importsfrom2': path.resolve(__dirname, './fixtures/importsfrom2.es6.js'),
    },
  })).result

  expect(result).toEqual({
    importsfrom1: { version: '1.x', js: { 'importsfrom1.js': {} }, dependencies: ['commons'] },
    importsfrom2: { version: '1.x', js: { 'importsfrom2.js': {} }, dependencies: ['commons'] },
    commons: { version: '1.x', js: { 'commons.js': {} } },
  })
})

test('Tracks a shared runtime chunk', async () => {
  const result = (await runWebpack({
    optimization: {
      runtimeChunk: 'single',
    },
    entry: {
      'a': path.resolve(__dirname, './fixtures/a.es6.js'),
      'b': path.resolve(__dirname, './fixtures/b.es6.js'),
    },
  })).result

  expect(result).toEqual({
    a: { version: '1.x', js: { 'a.js': {} }, dependencies: ['runtime'] },
    b: { version: '1.x', js: { 'b.js': {} }, dependencies: ['runtime'] },
    runtime: { version: '1.x', js: { 'runtime.js': {} } }
  })
})
