/**
 * Represents a library file to be generated.
 */
module.exports = class DrupalLibraryFile {

  /**
   * Creates a library file object.
   *
   * @param {string} targetPath
   *   The path where the file should be written to.
   * @param {object} content
   *   The library file content as a javascript object.
   * @param {DrupalLibraryMetadata{}} metadataObjects
   *   A map of metadata objects where each entry represents an entry in the
   *   library.
   */
  constructor(targetPath, content, metadataObjects) {
    this.targetPath = targetPath
    this.content = content || {}
    this.metadata = metadataObjects || {}
  }

  /**
   * Adds a library to the file.
   *
   * @param {string} name
   *   The name of the library.
   * @param {object} content
   *   The library object to pull from.
   * @param {DrupalLibraryMetadata{}} metadata
   *   A map of metadata objects to pull from.
   */
  add(name, content, metadata) {
    this.content[name] = content[name]
    this.metadata[name] = metadata[name]
  }

}
