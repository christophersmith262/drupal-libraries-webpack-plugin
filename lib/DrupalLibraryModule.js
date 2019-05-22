const Module = require('webpack').Module,
  RawSource = require('webpack-sources').RawSource

/**
 * A webpack module representing a Drupal library dependency.
 */
module.exports = class DrupalLibraryModule extends Module {

  constructor(name) {
    super("", null)

    this.name = name
  }

  identifier() {
    return "drupal " + this.name
  }

  readableIdentifier() {
    return "drupal " + this.name
  }

  needRebuild() {
    false
  }

  build(options, compilation, resolver, fs, callback) {
    this.build = true
    this.buildMeta = {}
    this.buildInfo = {}
    callback()
  }

  source(dependencyTemplates) {
    return new RawSource('')
  }

  size() {
    return 0
  }

}
