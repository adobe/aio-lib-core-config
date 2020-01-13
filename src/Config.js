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

const path = require('path')
const os = require('os')
const dotenv = require('./dotenv')
const debug = require('debug')('aio-cli-config')
const { merge, loadFile, saveFile, getValue, setValue } = require('./util')

/**
 * read a file and log exceptions to debug
 *
 * @param {String} file
 * @param {Function} debugFn
 */
const readFile = (file) => {
  debug(`reading config: ${file}`)
  try {
    return loadFile(file)
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      debug(ex.toString())
    }
  }
  return { format: 'json' }
}

class Config {
  reload() {
    dotenv(true)

    const configBasePath = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config')
    this.global = { file: process.env.AIO_CONFIG_FILE || path.join(configBasePath, 'aio') }
    this.local = { file: path.join(process.cwd(), '.aio') }

    this.global = { ...this.global, ...readFile(this.global.file) }
    this.local = { ...this.local, ...readFile(this.local.file) }

    this.envs = {}

    const envKeys = []
    for (const key in process.env) {
      const match = key.match(/^AIO_(.+)/i)
      if (match) {
        const newKey = match[1].toLowerCase()
          .split(/(?<!_)_(?!_)/)
          .join('.')
          .replace(/__/gi, '_')
        envKeys.push(newKey)
        this.envs = setValue(newKey, process.env[key], this.envs)
      }
    }

    if (envKeys.length > 0) {
      debug(`reading env variables: ${envKeys.join(', ')}`)
    }

    this.values = merge(this.global.values, this.local.values, this.envs)
    return this
  }

  get(key = '', source) {
    this.values || this.reload()
    let vals = this.values

    if (source === 'global') vals = this.global.values
    else if (source === 'local') vals = this.local.values
    else if (source === 'env') vals = this.envs

    const value = getValue(vals, key)
    if (value == null) return value
    return JSON.parse(JSON.stringify(value))
  }

  set(key, value, local = false) {
    this.values || this.reload()

    const config = (local) ? this.local : this.global
    const obj = setValue(key, value, config.values)

    debug(`writing config: ${key || '<all>'} at ${config.file}`)

    saveFile(config.file, obj, config.format)
    return this.reload()
  }
}

module.exports = Config
