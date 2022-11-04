const webpack = require('webpack'),
  path = require('path'),
  DrupalLibrariesPlugin = require('../../')

module.exports = async (webpackOpts, pluginOpts, extraPlugins) => {
  extraPlugins = extraPlugins || []

  pluginOpts = Object.assign({
    path: false,
  }, pluginOpts || {})

  const plugin = new DrupalLibrariesPlugin(pluginOpts || {})

  webpackOpts = Object.assign({
    mode: 'production',
    output: { path: path.resolve(__dirname, '../.tmp') },
    plugins: [plugin],
  }, webpackOpts || {})

  webpackOpts.plugins = webpackOpts.plugins.concat(extraPlugins)

  return await new Promise((accept, reject) => {
    webpack(webpackOpts, (err, stats) => {
      if (err) {
        reject(err)
      }
      else if (stats.hasErrors()) {
        reject(new Error(stats.toString()))
      }
      else {
        accept(plugin)
      }
    })
  })
}
