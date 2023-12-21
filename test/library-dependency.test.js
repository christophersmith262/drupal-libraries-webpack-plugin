const path = require('path'),
  runWebpack = require('./lib/webpack-wrapper')

test('Generates a library entry for @drupal(core/drupal)', async () => {
  const result = (await runWebpack({
    entry: {
      'require-drupal': path.resolve(__dirname, './fixtures/require-drupal.es6.js'),
    },
    externals: {
      '@drupal(drupal/core)': 'Drupal'
    }
  })).result

  expect(result).toEqual({
    'require-drupal': {
      js: { 'require-drupal.js': {} },
      dependencies: [ 'drupal/core' ],
    },
  })
})
