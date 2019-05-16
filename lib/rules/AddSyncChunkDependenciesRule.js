const DrupalLibraryRule = require('./DrupalLibraryRule')

/**
 * A basic analyzer for synchronously loaded webpack dependencies.
 *
 * This goes through each webpack chunk and finds the other webpack chunks that
 * it needs to be loaded through <script> tags on the page.
 */
module.exports = class AddSyncChunkDependenciesRule extends DrupalLibraryRule {

  /**
   * {@inheritdoc}
   */
  decorate(opts, metadata) {
    this._getDependencies(opts, metadata.chunk).forEach(dependencyName => {
      if (dependencyName != metadata.name) {
        metadata.addItem('dependencies', dependencyName)
      }
    })
  }

  /**
   * Generate a list of dependencies for a chunk.
   *
   * @param {object} opts
   *   The options passed to the plugin.
   * @param {webpack.Chunk} chunk
   *   The webpack chunk to generate dependencies for.
   *
   * @return {string}
   *   A list of library dependencies for the webpack chunk.
   */
  _getDependencies(opts, chunk) {
    const dependencies = []

    if (chunk.hasEntryModule()) {
      for (const group of chunk.groupsIterable) {
        for (const chunkDependency of group.chunks) {
          if (chunkDependency !== chunk) {
            dependencies.push(opts.nameGenerator(chunkDependency))
          }
        }
      }
    }

    return dependencies
  }

}
