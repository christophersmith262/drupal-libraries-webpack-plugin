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
   */
  decorate(opts, metadata) {
    /* istanbul ignore next */
    throw new Error('unimplemented decorate method')
  }

}
