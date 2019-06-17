[![Build Status](https://travis-ci.org/christophersmith262/drupal-libraries-webpack-plugin.svg?branch=master)](https://travis-ci.org/christophersmith262/drupal-libraries-webpack-plugin)
[![Coverage Status](https://coveralls.io/repos/github/christophersmith262/drupal-libraries-webpack-plugin/badge.svg?branch=master)](https://coveralls.io/github/christophersmith262/drupal-libraries-webpack-plugin?branch=master)
[![npm version](https://img.shields.io/npm/v/drupal-libraries-webpack-plugin.svg?style=flat)](https://www.npmjs.com/package/drupal-libraries-webpack-plugin) [![Greenkeeper badge](https://badges.greenkeeper.io/christophersmith262/drupal-libraries-webpack-plugin.svg)](https://greenkeeper.io/)

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img height="200" src="https://www.drupal.org/files/druplicon-small.png">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" vspace="" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
  <h1>drupal-libraries-webpack-plugin</h1>
</div>

This plugin generates a Drupal asset library file based on a webpack build.

<h2 align="center">Install</h2>

```bash
npm install --save-dev drupal-libraries-webpack-plugin
```

<h2 align="center">Usage</h2>

**webpack.config.js**

```js
module.exports = {
  plugins: [
  	new DrupalLibrariesPlugin()
  ],
};
```

By default, when you compile webpack, the drupal library file will be generated to 'webpack.libraries.yml'.

The plugin will automatically figure out what libraries need to depend on other libraries based on the final webpack chunks.

You can explicitly add a Drupal library dependency to module by using a special `require` statement:

```js
require('@drupal(core/jquery)')
```

### Configuration

#### `path`

Type: `String|Function`

Default: `'webpack.libraries.yml'`

Specifies a custom public path for the target webpack file relative to the process working directory.

#### Minimal example

**webpack.config.js**

```js
module.exports = {
  plugins: [
  	new DrupalLibrariesPlugin({
  	  path: 'my-theme-name.libraries.yml',
  	})
  ],
};
```

#### Advanced Example

Split a library into multiple library files.

```js
module.exports = {
  plugins: [
  	new DrupalLibrariesPlugin({
  	  	
  	  path: (library, metadata) => {
  	    const lib1 = new DrupalLibraryFile('a.libraries.yml'),
  	    	lib2 = new DrupalLibraryFile('webpack.libraries.yml')

  	    Object.keys(library).forEach(name => {
  	      if (name == 'a') {
  	        lib1.add(name, library, metdata)
  	      }
  	      else {
  	        lib2.add(name, library, metadata)
  	      }
  	    })
  	    
  	    return [lib1, lib2]
  	  }
  	})
  ],
};
```

------------------------------------------------------------------------

#### `nameGenerator`

Type: `Function`

Default: `nameGenerator`

Generates a library name for a chunk.

#### Minimal example

**webpack.config.js**

```js
module.exports = {
  plugins: [
  	new DrupalLibrariesPlugin({
  	  nameGenerator: chunk => chunk.hash
  	})
  ],
};
```

------------------------------------------------------------------------

#### `requirePattern`

Type: `RegExp`

Default: `/^@drupal\(([^\)]+)\)$/`

The pattern to use for detecting drupal library dependencies.

```js
module.exports = {
  plugins: [
  	new DrupalLibrariesPlugin({
  	  // Only pick up require('jquery') or require('Drupal') statements.
  	  libraryPattern: /^(jquery|Drupal)$/
  	})
  ],
};
```

------------------------------------------------------------------------

#### `prepareFile`

Type: `Function`

Default: `DrupalLibrariesPlugin.defaults.prepareFile`

Prepares a library file that is about to be written.

**webpack.config.js**

```js
module.exports = {
  plugins: [
  	new DrupalLibrariesPlugin({
  	  prepareFile: (file, compiler, compilation) => {
  	    // Add an extra entry to the file when outputting
  	    file.content['external'] = {
  	      remote: 'https://external-library.js',
  	    }
  	    return DupalLibrariesPlugin.defaults.prepareFile(file, compiler, compilation)
  	  },
  	})
  ],
};
```

------------------------------------------------------------------------

#### `libraryEntryGenerator`

Type: `DrupalLibraryEntryGenerator`

Default: `DrupalLibraryEntryGenerator`

Generates a flat Drupal library entry as a javascript object from a `DrupalLibraryMetadata` object.

**webpack.config.js**

```js
class StaticVersionLibraryGenerator extends DrupalLibraryEntryGenerator {
  constructor(version) {
    this.version = version
  }
  
  async versionGenerator(metadata) {
    return this.version
  }
}

module.exports = {
  plugins: [
  	new DrupalLibrariesPlugin({
  	  libraryEntryGenerator: new StaticVersionLibraryGenerator('2.0'),
  	})
  ],
};
```
