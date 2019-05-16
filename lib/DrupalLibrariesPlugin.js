const path = require('path'),
  YAML = require('yaml'),
  DrupalLibraryEntryGenerator = require('./DrupalLibraryEntryGenerator'),
  DrupalLibraryFile = require('./DrupalLibraryFile'),
  DrupalLibraryMetadata = require('./DrupalLibraryMetadata')

/**
 * A webpack plugin for generating drupal libraries files.
 */
class DrupalLibrariesPlugin {

  /**
   * Creates the Drupal libraries webpack plugin.
   *
   * @param {object} opts
   *   Plugin options.
   */
  constructor(opts) {
    opts = opts || {}

    opts.nameGenerator = opts.nameGenerator || DrupalLibrariesPlugin.defaults.nameGenerator
    opts.rules = opts.rules || DrupalLibrariesPlugin.defaults.rules
    opts.libraryEntryGenerator = opts.libraryEntryGenerator || new DrupalLibraryEntryGenerator()

    opts.prepareFile = opts.prepareFile || DrupalLibrariesPlugin.defaults.prepareFile

    if (opts.path === false) {
      opts.path = (result, metadata) => { return [] }
    }
    else if (typeof opts.path !== 'function') {
      const targetPath = opts.path || 'webpack.libraries.yml'
      opts.path = (result, metadata) => {
        return [new DrupalLibraryFile(targetPath, result, metadata)]
      }
    }

    this.opts = opts
    this.result = null
  }

  /**
   * Webpack plugin entrypoint.
   *
   * @param {webpack.Compiler}
   *   The webpack compiler.
   */
  apply(compiler) {
    compiler.hooks.done.tapPromise('DrupalLibrariesPlugin ', async stats => {
      this.metadata = this._generateLibraryMetadata(stats.compilation)
      this.result = this._generateLibraries(this.metadata)
      this.files = this.opts.path(this.result, this.metadata)
      this._writeResult(compiler, stats.compilation, this.files)
    })
  }

  /**
   * Creates library file contents in the Drupal format.
   *
   * @param {DrupalLibraryMetadata{}} metadataObjects
   *   A map of metadata objects to generate libraries from.
   *
   * @return {object}
   *   A generic object containing library entries.
   */
  _generateLibraries(metadataObjects) {
    const libraries = {},
      generator = this.opts.libraryEntryGenerator

    Object.keys(metadataObjects).forEach(name => {
      const metadata = metadataObjects[name],
        entry = generator.generate(metadata)

      if (entry) {
        libraries[metadata.name] = entry
      }
    })

    return libraries
  }

  /**
   * Creates a metadata object for each webpack chunk in a compilation.
   *
   * @param {webpack.Compilation} compilation
   *   The compilation object from the webpack instance.
   *
   * @return {DrupalLibraryMetadata[]}
   *   A list of metadata for generating chunk information.
   */
  _generateLibraryMetadata(compilation) {
    const entries = {}

    for (const chunk of compilation.chunks) {
      const libraryName = this.opts.nameGenerator(chunk),
        metadata = new DrupalLibraryMetadata(libraryName, chunk)

      if (entries[metadata.name]) {
        throw new DrupalLibraryMetadata.KeyCollisionError('Two webpack chunks resulted in the same library name.')
      }

      this.opts.rules.forEach(rule => {
        rule.decorate(this.opts, metadata)
      })

      entries[metadata.name] = metadata
    }

    return entries
  }

  /**
   * Writes the generated Drupal library to the filesystem.
   *
   * @param {webpack.Compiler} compiler
   *   The compiler object from the webpack instance.
   * @param {webpack.Compilation} compilation
   *   The compilation object from the webpack instance.
   * @param {DrupalLibraryFile[]} files
   *   An array of library files to be written.
   */
  _writeResult(compiler, compilation, files) {
    files.forEach(file => {
      file = this.opts.prepareFile(file, compiler, compilation)

      const content = YAML.stringify(file.content),
        targetPath = compilation.getPath(file.targetPath)

      compiler.outputFileSystem.mkdirp(path.dirname(targetPath), err => {
        if (err) {
          throw new Error(err.message)
        }
        compiler.outputFileSystem.writeFile(targetPath, content, err => {
          if (err) {
            throw new Error(err.message)
          }
        })
      })
    })
  }

}

DrupalLibrariesPlugin.defaults = require('./defaults')
DrupalLibrariesPlugin.rules = require('./rules')

module.exports = DrupalLibrariesPlugin
