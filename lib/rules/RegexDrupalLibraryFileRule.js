const DrupalLibraryRule = require('./DrupalLibraryRule')

/**
 * A generic rule for sorting files into groups (mainly css / js).
 */
module.exports = class RegexDrupalLibraryFileRule extends DrupalLibraryRule {

  /**
   * Creates a regex matcher rule.
   *
   * @param {RegExp} regex
   *   The regular expression.
   * @param {string} group
   *   The metadata group name to add files that match the regex to.
   */
  constructor(regex, group) {
    super()
    this._regex = regex
    this._group = group
  }

  /**
   * {@inheritdoc}
   */
  decorate(opts, metadata) {
    metadata.chunk.files.forEach(filename => {
      if (this._regex.test(filename)) {
        metadata.addItem(this._group, filename)
      }
    })
  }

}
