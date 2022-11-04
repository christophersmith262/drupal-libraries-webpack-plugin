/**
 * Represents a rule for generating library files.
 */
module.exports = class DrupalLibraryRule {

  /**
   * Mutates a metadata object.
   *
   * @param {object} opts
   *   The options passed to the plugin.
   * @param {DrupalLibraryMetadata}
   *   The metadata object being generated.
   * @param {object} chunkGraph
   *   The chunk graph for the current compilation.
   */
  async decorate(opts, metadata, chunkGraph) {
    /* istanbul ignore next */
    throw new Error('unimplemented decorate method')
  }

}
