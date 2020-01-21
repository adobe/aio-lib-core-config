/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const Config = require('./Config')
const pipe = require('./pipe')
const dotenv = require('./dotenv')
const config = new Config()

/**
 * This class provides methods to access the config for Adobe I/O libraries.
 */
class ConfigAPI {
  /**
   * Gets the value for a key in the Config.
   * If no parameters are specified, it will return all keys and values of the consolidated Config.
   *
   * @param {string} [key=''] the key to get the value from
   * @param {string} [source] 'global', 'local', or 'env'. Defaults to searching the consolidated config.
   */
  get(key, source) {
    return config.get(key, source)
  }

  /**
   * Set the value for a key in the Config.
   *
   * @param {string} key the key to set the value to
   * @param {string} value the value to save for the key
   * @param {boolean} [local=false] Set to true to save the value in the local config. Defaults to false (save to global config).
   */
  set(key, value, local) {
    return config.set(key, value, local) && this
  }

  /**
   * Delete a key and its value in the Config.
   *
   * @param {string} key the key to delete the value from
   * @param {boolean} [local=false] Set to true to delete the value in the local config. Defaults to false (save to global config).
   */
  delete(key, local) {
    return config.set(key, null, local) && this
  }

  /**
   * Reload the Config from all the config file(s)
   */
  reload() {
    return config.reload() && this
  }

  /**
   * Pipe data from stdin.
   *
   * @function
   * @return {Promise<string>}
   */
  get getPipedData() {
    return pipe
  }

  /**
   * Hoists variables in the ./.env file to process.env
   *
   * @function
   * @param {Object} the dotenv object
   */
  get dotenv() {
    return dotenv
  }
}

/**
 * @returns {ConfigAPI}
 */
module.exports = new ConfigAPI()
