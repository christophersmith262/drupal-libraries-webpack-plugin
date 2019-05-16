const path = require('path'),
  rules = require('./rules')

module.exports = {}

/**
 * A standard set of rules for creating library entries based on webpack chunks.
 */
module.exports.rules = [
  new rules.RegexDrupalLibraryFileRule(/\.css$/, 'css'),
  new rules.RegexDrupalLibraryFileRule(/\.js$/, 'js'),
  new rules.AddSyncChunkDependenciesRule(),
  new rules.IgnoreAsyncChunksRule(),
]

/**
 * Generates a Drupal library name based on a webpack chunk.
 *
 * @param {webpack.Chunk} chunk
 *   The webpack chunk the library will correspond to.
 *
 * @return {string}
 *   The name of the Drupal library entry.
 */
module.exports.nameGenerator = async (chunk) => {
  if (chunk.name) {
    return chunk.name.replace(/[^a-zA-Z0-9\-_]+/, '-')
      .replace(/-+$/, '')
  }
  else {
    return chunk.hash
  }
}

/**
 * Prepares a file by updating all paths to be relative to the output path.
 *
 * @param {DrupalLibraryFile} file
 *   The file that will be created.
 * @param {webpack.Compiler} compiler
 *   The webpack compiler.
 * @param {webpack.Compilation} compilation
 *   The webpack compilation instance.
 *
 * @return {DrupalLibraryFile}
 *   The mutated file object.
 */
module.exports.prepareFile = async (file, compiler, compilation) => {
  const outputPath = compilation.getPath(compiler.outputPath)

  function relativePath(targetPath, filePath) {
    return path.relative(path.dirname(targetPath), path.resolve(outputPath, filePath))
  }

  function replaceEntry(obj, filePath) {
    const entry = obj[filePath]
    delete obj[filePath]
    obj[relativePath(file.targetPath, filePath)] = entry
  }

  function getKeys(obj) {
    if (typeof obj === 'object') {
      return Object.keys(obj)
    }
    else {
      return []
    }
  }

  getKeys(file.content).forEach(name => {
    getKeys(file.content[name].js).forEach(jsFile => {
      replaceEntry(file.content[name].js, jsFile)
    })

    getKeys(file.content[name].css).forEach(cssGroup => {
      getKeys(file.content[name].css[cssGroup]).forEach(cssFile => {
        replaceEntry(file.content[name].css[cssGroup], cssFile)
      })
    })
  })

  return file
}
