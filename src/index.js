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

module.exports = (() => {
  /**
   * Gets the value for a key in the Config.
   * If no parameters are specified, it will return all keys and values of the consolidated Config.
   *
   * @global
   * @param {string} [key=''] the key to get the value from
   * @param {string} [source] 'global', 'local', or 'env'. Defaults to searching the consolidated config.
   */
  this.get = (key, source) => config.get(key, source)

  /**
   * Set the value for a key in the Config.
   *
   * @global
   * @param {string} key the key to set the value to
   * @param {string} value the value to save for the key
   * @param {string} [local=false] Set to true to save the value in the local config. Defaults to false (save to global config).
   */
  this.set = (key, value, local) => config.set(key, value, local) && this

  /**
   * Delete a key and its value in the Config.
   *
   * @global
   * @param {string} key the key to delete the value from
   * @param {string} [local=false] Set to true to delete the value in the local config. Defaults to false (save to global config).
   */
  this.delete = (key, local) => config.set(key, null, local) && this

  /**
   * Reload the Config from all the config file(s)

   * @global
   */
  this.reload = () => config.reload() && this

  /**
   * Pipe data from stdin.
   *
   * @global
   * @function
   * @return {Promise}
   */
  this.getPipedData = pipe

  /**
   * Hoists variables in the ./.env file to process.env
   *
   * @global
   * @function
   * @param {boolean} [force=false] force reload of the .env file
   */
  this.dotenv = dotenv

  return this
})()
