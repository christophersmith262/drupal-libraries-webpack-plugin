class DrupalLibraryMetadata {

  /**
   * Creates a library metadata object.
   *
   * @param {string}
   *   Library name that will be written to the libraries file.
   * @param {webpack.Chunk}
   *   The chunk the library entry will be created for.
   */
  constructor(libraryName, sourceChunk) {
    this._data = {}
    this.skip = false
    this.name = libraryName
    this.chunk = sourceChunk
  }

  /**
   * Adds chunk data to a group.
   *
   * @param {string} group
   *   The group name.
   * @param {mixed} value
   *   The value to add
   */
  addItem(group, value) {
    if (!this._data[group]) {
      this._data[group] = []
    }

    this._data[group].push(value)
  }

  /**
   * Determines if the library has items in a group.
   *
   * @param {string} group
   *   The group name.
   *
   * @return {bool}
   *   True if items exist in the group, False otherwise.
   */
  hasItems(group) {
    return !!this._data[group]
  }

  /**
   * Gets items from a group.
   *
   * @param {string} group
   *   The group name.
   *
   * @return {mixed[]}
   *   An array of all items in the group.
   */
  getItems(group) {
    return this._data[group] || []
  }

}

DrupalLibraryMetadata.KeyCollisionError = class KeyCollissionError extends Error { }

module.exports = DrupalLibraryMetadata 
