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
  generate(metadata) {
    if (metadata.skip) {
      return
    }

    const library = {
      version: this.versionGenerator(metadata)
    }

    if (metadata.hasItems('css')) {
      library['css'] = this.createCssEntries(metadata, metadata.getItems('css'))
    }

    if (metadata.hasItems('js')) {
      library['js'] = this.createJsEntries(metadata, metadata.getItems('js'))
    }

    if (metadata.hasItems('dependencies')) {
      library['dependencies'] = this.createDependencyEntries(metadata, metadata.getItems('dependencies'))
    }

    return library
  }

  /**
   * Generates the version entry for a Drupal library entry.
   *
   * @param {DrupalLibraryMetadata} metadata
   */
  versionGenerator(metadata) {
    return '1.x'
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
  createCssEntries(metadata, assets) {
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
  createJsEntries(metadata, assets) {
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
  createDependencyEntries(metadata, assets) {
    return assets
  }

}
