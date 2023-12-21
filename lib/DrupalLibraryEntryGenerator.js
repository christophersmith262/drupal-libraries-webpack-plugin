module.exports = class LibraryEntryGenerator {

  /**
   * Generates a Drupal library entry for a webpack chunk.
   *
   * @param {DrupalLibraryMetadata} metadata
   *   The metadata for the library being generated.
   *
   * @return {object}
   *   The generated Drupal library entry.
   */
  async generate(metadata) {
    if (metadata.skip) {
      return
    }

    const promises = [], library = {}

    promises.push(this.versionGenerator(metadata).then(version => {
      if (version) {
        library['version'] = version
      }
    }))

    if (metadata.hasItems('css')) {
      promises.push(this.createCssEntries(metadata, metadata.getItems('css')).then(css => {
        library['css'] = css
      }))
    }

    if (metadata.hasItems('js')) {
      promises.push(this.createJsEntries(metadata, metadata.getItems('js')).then(js => {
        library['js'] = js
      }))
    }

    if (metadata.hasItems('dependencies')) {
      promises.push(this.createDependencyEntries(metadata, metadata.getItems('dependencies')).then(deps => {
        library['dependencies'] = deps
      }))
    }

    await Promise.all(promises)

    return library
  }

  /**
   * Generate a version for a Drupal library entry. Does nothing by default.
   * Use `libraryEntryGenerator` option to set a version number.
   *
   * @param {DrupalLibraryMetadata} metadata
   */
  async versionGenerator(metadata) {
    return false
  }


  /**
   * Creates the css entries for a library entry.
   *
   * @param {DrupalLibraryMetadata} metadata
   *   The metadata for the library being generated.
   * @param {string[]} assets
   *   The names of assets being generated, relative to the output path.
   *
   * @return {object}
   *   A Drupal library css entry.
   */
  async createCssEntries(metadata, assets) {
    const css = { theme: {} }

    assets.forEach(filename => {
      css.theme[filename] = {}
    })

    return css
  }

  /**
   * Creates the js entries for a library entry.
   *
   * @param {DrupalLibraryMetadata} metadata
   *   The metadata for the library being generated.
   * @param {string[]} assets
   *   The names of assets being generated, relative to the output path.
   *
   * @return {object}
   *   A Drupal library js entry.
   */
  async createJsEntries(metadata, assets) {
    const js = {}

    assets.forEach(filename => {
      js[filename] = {}
    })

    return js
  }

  /**
   * Creates the list of dependencies for a library entry.
   *
   * @param {DrupalLibraryMetadata} metadata
   *   The metadata for the library being generated.
   * @param {string[]} assets
   *   The names of other library entries this library depends on.
   *
   * @return {object}
   *   A Drupal library dependencies entry.
   */
  async createDependencyEntries(metadata, assets) {
    return assets
  }

}
