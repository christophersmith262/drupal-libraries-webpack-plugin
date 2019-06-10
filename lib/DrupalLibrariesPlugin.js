const path = require('path'),
  YAML = require('yaml'),
  DrupalLibraryEntryGenerator = require('./DrupalLibraryEntryGenerator'),
  DrupalLibraryFile = require('./DrupalLibraryFile'),
  DrupalLibraryMetadata = require('./DrupalLibraryMetadata'),
  DrupalLibraryModule = require('./DrupalLibraryModule')

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
    opts.requirePattern = opts.requirePattern || DrupalLibrariesPlugin.defaults.requirePattern

    opts.prepareFile = opts.prepareFile || DrupalLibrariesPlugin.defaults.prepareFile

    if (opts.path === false) {
      opts.path = async (result, metadata) => { return [] }
    }
    else if (typeof opts.path !== 'function') {
      const targetPath = opts.path || 'webpack.libraries.yml'
      opts.path = async (result, metadata) => {
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
    // Prevents drupal library dependencies from being included.
    compiler.hooks.normalModuleFactory.tap('DrupalLibrariesPlugin', cmf => {
      cmf.hooks.factory.tap("DrupalLibrariesPlugin", factory => (data, callback) => {
        const result = this.opts.requirePattern.exec(data.request)
        if (result) {
          callback(null, new DrupalLibraryModule(result[1]))
        }
        else {
          factory(data, callback)
        }
      })
    })

    // Analyzes the final chunks to determine library dependencies.
    compiler.hooks.done.tapPromise('DrupalLibrariesPlugin', async stats => {
      this.metadata = await this._generateLibraryMetadata(stats.compilation)
      this.result = await this._generateLibraries(this.metadata)
      this.files = await Promise.resolve(this.opts.path(this.result, this.metadata))
      await this._writeResult(compiler, stats.compilation, this.files)
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
  async _generateLibraries(metadataObjects) {
    const libraries = {},
      generator = this.opts.libraryEntryGenerator,
      promises = []

    Object.keys(metadataObjects).forEach(name => {
      const metadata = metadataObjects[name]

      promises.push(generator.generate(metadata).then(entry => {
        if (entry) {
          libraries[metadata.name] = entry
        }
      }))
    })

    await Promise.all(promises)

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
  async _generateLibraryMetadata(compilation) {
    const entries = {}, promises = []

    for (const chunk of compilation.chunks) {
      promises.push(Promise.resolve(this.opts.nameGenerator(chunk)).then(libraryName => {
        const metadata = new DrupalLibraryMetadata(libraryName, chunk)

        if (entries[metadata.name]) {
          throw new DrupalLibraryMetadata.KeyCollisionError('Two webpack chunks resulted in the same library name.')
        }

        const promises = []
        this.opts.rules.forEach(rule => {
          promises.push(rule.decorate(this.opts, metadata))
        })

        entries[metadata.name] = metadata

        return Promise.all(promises)
      }))
    }

    await Promise.all(promises)

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
  async _writeResult(compiler, compilation, files) {
    const promises = []

    files.forEach(file => {
      promises.push(new Promise(async (accept, reject) => {
        file = await Promise.resolve(this.opts.prepareFile(file, compiler, compilation))

        const content = YAML.stringify(file.content),
          targetPath = compilation.getPath(file.targetPath)

        compiler.outputFileSystem.mkdirp(path.dirname(targetPath), err => {
          if (err) {
            throw reject(err.message)
          }
          compiler.outputFileSystem.writeFile(targetPath, content, err => {
            if (err) {
              throw reject(err.message)
            }
            accept()
          })
        })
      }))
    })

    await Promise.all(promises)
  }

}

DrupalLibrariesPlugin.defaults = require('./defaults')
DrupalLibrariesPlugin.rules = require('./rules')

module.exports = DrupalLibrariesPlugin
