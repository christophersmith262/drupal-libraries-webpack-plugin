const DrupalLibrariesPlugin = require('../').DrupalLibrariesPlugin,
  DrupalLibraryEntryGenerator = require('../').DrupalLibraryEntryGenerator

test('Default name generator handles invalid library names', async () => {
  const run = DrupalLibrariesPlugin.defaults.nameGenerator
  await expect(run({ name: 'test' })).toBe('test')
  await expect(run({ name: 'test~~' })).toBe('test')
  await expect(run({ name: 'test~bundle' })).toBe('test-bundle')
  await expect(run({ name: 'test-it1' })).toBe('test-it1')
  await expect(run({ name: 'test_it1' })).toBe('test_it1')
  await expect(run({ name: 'test//it1' })).toBe('test-it1')

  await expect(run({ name: 'test', hash: '123' })).toBe('test')
  await expect(run({ name: null, hash: '123' })).toBe('123')
})

test('Plugin instantiates without error', async () => {
  await expect(() => new DrupalLibrariesPlugin()).not.toThrow()
})

test('Plugin has correct default values', async () => {
  const plugin = new DrupalLibrariesPlugin(),
    result = {}, library = {}, metadata = {}

  await expect(plugin.opts.nameGenerator).toBe(DrupalLibrariesPlugin.defaults.nameGenerator)
  await expect(plugin.opts.rules).toBe(DrupalLibrariesPlugin.defaults.rules)
  await expect(plugin.opts.prepareFile).toBe(DrupalLibrariesPlugin.defaults.prepareFile)

  const defaultPaths = plugin.opts.path(result, metadata)
  await expect(defaultPaths.length).toBe(1)
  await expect(defaultPaths[0].targetPath).toBe('webpack.libraries.yml')
  await expect(defaultPaths[0].content).toBe(result)
  await expect(defaultPaths[0].metadata).toBe(metadata)

  await expect(plugin.opts.libraryEntryGenerator).toBeInstanceOf(DrupalLibraryEntryGenerator)
})

test('Plugin can be customized with constructor options', async () => {
  const opts = {
    nameGenerator: '1',
    rules: '2',
    alterLibrary: '3',
    libraryEntryGenerator: '4',
    path: '5',
  }

  const plugin = new DrupalLibrariesPlugin(opts)

  await expect(plugin.opts).toBe(opts)
})
