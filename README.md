<!--
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->

@adobe/aio-lib-core-config
=======================

[![Version](https://img.shields.io/npm/v/@adobe/aio-lib-core-config.svg)](https://npmjs.org/package/@adobe/aio-lib-core-config)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/aio-lib-core-config.svg)](https://npmjs.org/package/@adobe/aio-lib-core-config)
![Node.js CI](https://github.com/adobe/aio-lib-core-config/workflows/Node.js%20CI/badge.svg)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-lib-core-config/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-lib-core-config/)
[![Size(minified)](https://badgen.net/bundlephobia/min/@adobe/aio-lib-core-config)](https://npmjs.org/package/@adobe/aio-lib-core-config)

This is a nodejs module to allow management of persistent and environment variable configuration.


The module can be added to your project with:

```javascript
npm install @adobe/aio-lib-core-config --save
```

Here is a snippet:

```javascript
const config = require('@adobe/aio-lib-core-config')

// set a key value
config.set('pgb.authtoken', 1234)

// reload data from files and environmental variables
config.reload()

// get all stored data
config.get()

// get data from a given key
config.get('pgb.authtoken')

// delete a key
config.delete('pgb.authtoken')
```

## Persistent File Locations

### User Configuration

The user default location is: 

1. **ENV['AIO_CONFIG_FILE']**
1. **ENV['XDG_CONFIG_HOME']/aio**
1. **\<HOME>/.config/aio**

depending on whether the specified environmental variables exist

### Project Configuration

Local configuration is loaded from **$PWD/.aio**

### Dot Env Configuration

A local .env file is also loaded.  This file can contain environmental variables

## Resolving Values

Resolving configuration is done in two steps:

1. .env file is read, parsed and hoisted to environment variables ( process.env )
2. user and local files are read

Inheritance is similar to NPMRC and can be set using user file, project file and matching environment variables. Values are read and merged in the following order in increasing priority:

1. user config eg. ~/.config/aio
2. project config eg. $PWD/.aio
3. environment variables matching AIO_\<PLUGIN>_\<KEY> 

```bash
$ AIO_PGB_AUTHTOKEN=1234 node
> config.get('pgb.authtoken')
1234

$ AIO_PGB_AUTH__TOKEN=1234 node # use double underscores to specify an underscore
> config.get('pgb.auth_token')
1234
```
## Explore

`goto` [API](./doc/api.md)

## Contributing
Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.
 
## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
