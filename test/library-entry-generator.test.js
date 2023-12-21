const path = require('path'),
  runWebpack = require('./lib/webpack-wrapper'),
  { DrupalLibraryEntryGenerator } = require('../')

  class StaticVersionLibraryGenerator extends DrupalLibraryEntryGenerator {
    constructor(version) {
      super();
      this.version = version
    }

    async versionGenerator(metadata) {
      return this.version
    }
  }

test('Extend the default library entry with a version number', async () => {
  const result = (await runWebpack({
    entry: {
      'a': path.resolve(__dirname, './fixtures/a.es6.js'),
    },
  }, {
    libraryEntryGenerator: new StaticVersionLibraryGenerator('2.0'),
  })).result

  await expect(result).toEqual({
    a: { version: '2.0', js: { 'a.js': {} } },
  })
})
