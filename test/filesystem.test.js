const path = require('path'),
  fs = require('fs'),
  runWebpack = require('./lib/webpack-wrapper')

test('Generates file by default', async () => {
  await runWebpack({
    entry: {
      'a': path.resolve(__dirname, './fixtures/a.es6.js'),
    },
  }, {
    path: undefined,
  })

  await expect(await new Promise(accept => {
    fs.access('webpack.libraries.yml', fs.constants.F_OK, err => {
      accept(err ? false : true)
    })
  })).toBe(true)
})
