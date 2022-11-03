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
  async decorate(opts, metadata, chunkGraph) {
    (await this._getDependencies(opts, metadata.chunk, chunkGraph)).forEach(dependencyName => {
      metadata.addItem('dependencies', dependencyName)
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
  async _getDependencies(opts, chunk, chunkGraph) {
    const dependencies = [], promises = []

    if (chunkGraph.getNumberOfEntryModules(chunk) > 0) {
      for (const group of chunk.groupsIterable) {
        for (const chunkDependency of group.chunks) {
          if (chunkDependency !== chunk) {
            promises.push(Promise.resolve(opts.nameGenerator(chunkDependency)).then(dep => {
              dependencies.push(dep)
            }))
          }
        }
      }
    }

    await Promise.all(promises)

    return dependencies
  }

}
