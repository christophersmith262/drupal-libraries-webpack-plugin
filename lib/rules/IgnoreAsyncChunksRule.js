const DrupalLibraryRule = require('./DrupalLibraryRule')

/**
 * Prevents entries for chunks that are loaded asynchronously by webpack.
 *
 * You can allow Drupal to load these chunks synchronously by disabling this
 * rule.
 */
module.exports = class IgnoreAsyncChunksRulke extends DrupalLibraryRule {

  /**
   * {@inheritdoc}
   */
  decorate(opts, metadata) {
    if (!metadata.chunk.canBeInitial()) {
      metadata.skip = true
    }
  }

}
