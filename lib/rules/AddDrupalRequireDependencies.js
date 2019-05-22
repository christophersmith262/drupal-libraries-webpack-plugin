const DrupalLibraryRule = require('./DrupalLibraryRule')

/**
 * An analyzer that will add 
 */
module.exports = class AddSyncChunkDependenciesRule extends DrupalLibraryRule {

  /**
   * {@inheritdoc}
   */
  async decorate(opts, metadata) {
    metadata.chunk.getModules().forEach(module => {
      module.dependencies.forEach(dependency => {
        const result = opts.requirePattern.exec(dependency.request)
        if (result && result[1] != metadata.name) {
          metadata.addItem('dependencies', result[1])
        }
      })
    })
  }

}

