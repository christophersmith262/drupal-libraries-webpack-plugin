const DrupalLibraryModule = require('../lib/DrupalLibraryModule')

test('DrupalLibraryModule instantiates without error', async () => {
  await expect(() => new DrupalLibraryModule()).not.toThrow()
})

test('DrupalLibraryModule generates correct identifier', async () => {
  const module = new DrupalLibraryModule('test'),
    expected = 'drupal test'

  await expect(module.identifier()).toEqual(expected)
  await expect(module.readableIdentifier()).toEqual(expected)
})
