const path = require('path'),
  runWebpack = require('./lib/webpack-wrapper')

test('Stops the webpack build if two chunks generate the same library name', async () => {
  await expect(
    runWebpack({
      entry: {
        'a': path.resolve(__dirname, './fixtures/a.es6.js'),
        'b': path.resolve(__dirname, './fixtures/b.es6.js'),
      },
    }, { nameGenerator: chunk => 'test' })
  ).rejects.toEqual(new Error('Two webpack chunks resulted in the same library name: "test"'))
})
