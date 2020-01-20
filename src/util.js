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

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const hjson = require('hjson')
const deepmerge = require('deepmerge')

/**
 * Support for mkdir -p.
 *
 * @param {String} dir the folder to create
 */
const mkdirp = dir => {
  dir = dir || ''
  const parts = path.resolve(dir).split(path.sep)
  for (let i = 1; i < parts.length; i++) {
    const segment = path.join(parts.slice(0, i + 1).join(path.sep) + path.sep)
    if (!fs.existsSync(segment)) fs.mkdirSync(segment)
  }
}

/**
 * Get property from object with case insensitivity.
 *
 * @param {Object} obj
 * @param {String} key
 */
const getProp = (obj, key) => obj[Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase())]

/**
 * Get a value in an object by dot notation.
 *
 * @param {String} key
 * @param {Object} obj
 *
 * @return {Object}
 */
const getValue = (obj, key) => {
  const keys = (key || '').toString().split('.')
  return keys.filter(o => o.trim()).reduce((o, i) => o && getProp(o, i), obj)
}

/**
 * Set a value by dot notation.
 *
 * @param {String} key
 * @param {String} value
 * @param {Object} [obj]
 *
 * @return {Object}
 */
const setValue = (key, value, obj) => {
  const parts = (key || '').split('.').filter(o => o.trim())
  if (parts.length === 0) return value

  const result = { ...obj }
  let node = result
  while (parts.length > 1) {
    const k = parts.shift()
    node[k] = (typeof node[k] === 'object') ? { ...node[k] } : {}
    node = node[k]
  }
  node[parts.shift()] = value
  return result
}

/**
 * Deep merge a collection of objs returning a new object.
 *
 * @param  {Array} objs array of objects
 *
 * @return {Object}
 */
const merge = (...objs) => {
  // array merge strategy (replace)
  const overwriteMerge = (destinationArray, sourceArray) => sourceArray
  // filter out undefined arguments
  const objArray = [...objs].filter(Boolean)

  return deepmerge.all(objArray, { arrayMerge: overwriteMerge })
}

/**
 * Remove empty leaves from an object.
 *
 * @param {Object} obj
 *
 * @return {Object}
 */
const shake = obj => {
  const shakeObject = o => {
    for (const prop in o) {
      if (o[prop] && o[prop].constructor === Object) {
        o[prop] = shakeObject(o[prop])
        if (Object.keys(o[prop]).length === 0) {
          delete o[prop]
        }
      } else if (o[prop] == null) {
        delete o[prop]
      }
    }
    return o
  }

  return shakeObject(obj)
}

/**
 * Deserialise from a file.
 *
 * @param {String} file
 *
 * @return {Object}
 */
const loadFile = (file) => {
  const contents = fs.readFileSync(file, 'utf-8').trim()

  if (contents) {
    if (contents[0] === '{') {
      try {
        return { values: hjson.parse(contents), format: 'json' }
      } catch (e) {
        throw new Error('Cannot parse json')
      }
    } else {
      try {
        return { values: yaml.safeLoad(contents, { json: true }), format: 'yaml' }
      } catch (e) {
        throw new Error('Cannot parse yaml')
      }
    }
  }
  return { values: {}, format: 'json' }
}

/**
 * yaml serialise an object to a file.
 *
 * @param {String} file
 * @param {Object} obj
 * @param {String} format
 */
const saveFile = (file, obj, format) => {
  obj = obj || {}
  mkdirp(path.dirname(file))

  obj = shake(obj)

  let str
  if (Object.keys(obj).length === 0) {
    str = ''
  } else if (format === 'json') {
    str = hjson.stringify(obj, { condense: true, emitRootBraces: true, separator: true, bracesSameLine: true, multiline: 'off' })
  } else {
    str = yaml.safeDump(obj, { sortKeys: true, lineWidth: 1024, noCompatMode: true })
  }

  fs.writeFileSync(file, str)
  return true
}

module.exports = { mkdirp, getValue, setValue, merge, loadFile, saveFile }
