exports = module.exports = require('./lib/DrupalLibrariesPlugin')

// @deprecated: remove in 2.x
exports.DrupalLibrariesPlugin = require('./lib/DrupalLibrariesPlugin')

exports.DrupalLibraryMetadata = require('./lib/DrupalLibraryMetadata')
exports.DrupalLibraryEntryGenerator = require('./lib/DrupalLibraryEntryGenerator')
exports.DrupalLibraryFile = require('./lib/DrupalLibraryFile')
exports.DrupalLibraryModule = require('./lib/DrupalLibraryFile')
