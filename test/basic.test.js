const path = require('path'),
  runWebpack = require('./lib/webpack-wrapper')

test('Tracks a single entrypoint', async () => {
  const result = (await runWebpack({
    entry: {
      'a': path.resolve(__dirname, './fixtures/a.es6.js'),
    },
  })).result

  await expect(result).toEqual({
    a: { version: '1.x', js: { 'a.js': {} } },
  })
})

test('Tracks a multiple entrypoints', async () => {
  const result = (await runWebpack({
    entry: {
      'a': path.resolve(__dirname, './fixtures/a.es6.js'),
      'b': path.resolve(__dirname, './fixtures/b.es6.js'),
    },
  })).result

  await expect(result).toEqual({
    a: { version: '1.x', js: { 'a.js': {} } },
    b: { version: '1.x', js: { 'b.js': {} } },
  })
})
