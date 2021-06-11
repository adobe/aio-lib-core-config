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

const os = require('os')
const fs = require('fs')
const path = require('path')
const hjson = require('hjson')

// mock dir stuff
const processcwd = process.cwd
const oshomedir = os.homedir

const hjsonFormat = (obj) => hjson.stringify(obj, { condense: true, emitRootBraces: true, separator: true, bracesSameLine: true, multiline: 'off' })
const HOME_DIR = '/Users/foo'
const WORKING_DIR = '/Project/runtime'
let originalXdgConfigHome

beforeAll(() => {
  os.homedir = () => path.resolve(HOME_DIR)
  process.cwd = () => path.resolve(WORKING_DIR)
  originalXdgConfigHome = process.env.XDG_CONFIG_HOME
})

afterAll(() => {
  process.cwd = processcwd
  os.homedir = oshomedir
  if (originalXdgConfigHome) {
    process.env.XDG_CONFIG_HOME = originalXdgConfigHome
  }
})

const Config = require('../src/Config')

beforeEach(() => {
  delete process.env.XDG_CONFIG_HOME
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Config', () => {
  test('should export a function', () => {
    expect(typeof Config).toEqual('function')
  })

  test('should return an object', () => {
    const config = new Config()
    expect(config.constructor.name).toEqual('Config')
  })

  test('should initialise values (XDG_CONFIG_HOME unset)', () => {
    const config = new Config()
    config.reload()
    expect(config.global).toEqual({ file: path.resolve(`${HOME_DIR}/.config/aio`), format: 'json' })
    expect(config.local).toEqual({ file: path.resolve(`${WORKING_DIR}/.aio`), format: 'json' })
  })

  test('should initialise values (XDG_CONFIG_HOME set)', () => {
    const configHome = process.env.XDG_CONFIG_HOME = path.resolve('/foo/bar')
    const config = new Config()
    config.reload()
    expect(config.global).toEqual({ file: path.resolve(`${configHome}/aio`), format: 'json' })
    expect(config.local).toEqual({ file: path.resolve(`${WORKING_DIR}/.aio`), format: 'json' })
  })

  describe('load', () => {
    test('should be passed in function', () => {
      const debug = () => true
      const config = new Config(debug)
      expect(config.reload()).toBe(config)
    })
  })

  describe('get', () => {
    test('should be an empty function', () => {
      const config = new Config()
      expect(config.get()).toEqual(config.values)
      expect(config.get('')).toEqual(config.values)
      expect(config.get('    ')).toEqual(config.values)
    })

    test('should default to json storage', () => {
      const config = new Config()
      config.reload()
      expect(config.global.format).toBe('json')
      expect(config.local.format).toBe('json')
    })

    test('should return undefined on unknown key', () => {
      const config = new Config()
      expect(config.get('unknown.key')).toEqual(undefined)
    })

    test('should return value at key', () => {
      const config = new Config()
      config.values = { a: { key: 'global1' } }
      expect(config.get('a.key')).toEqual('global1')
    })

    test('should return env value at key', () => {
      const config = new Config()
      config.global = { values: { a: { key: 'global2' } } }
      config.values = {}
      expect(config.get('a.key', 'global')).toEqual('global2')
    })

    test('should return local value at key', () => {
      const config = new Config()
      config.local = { values: { a: { key: 'local' } } }
      config.values = {}
      expect(config.get('a.key', 'local')).toEqual('local')
    })

    test('should return global value at key', () => {
      const config = new Config()
      config.envs = { a: { key: 'env' } }
      config.values = {}
      expect(config.get('a.key', 'env')).toEqual('env')
    })
  })

  describe('set', () => {
    let config

    beforeEach(() => {
      config = new Config()
      jest.spyOn(fs, 'writeFileSync')
      config.debug = jest.fn()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      fs.unlinkSync('/Project/runtime/.aio')
      fs.unlinkSync('/Users/foo/.config/aio')
    })

    test('should set global value if key empty', () => {
      expect(config.set()).toBe(config)
      expect(config.set('')).toBe(config)
      expect(config.set('    ')).toBe(config)
      expect(fs.writeFileSync).toHaveBeenCalledWith(path.resolve('/Users/foo/.config/aio'), '')
      expect(config.get()).toEqual({})
    })

    test('should save to global file', () => {
      expect(config.set('a.key', 'value1')).toBe(config)
      expect(fs.writeFileSync).toHaveBeenCalledWith(path.resolve('/Users/foo/.config/aio'), hjsonFormat({ a: { key: 'value1' } }))
      expect(config.get()).toEqual({ a: { key: 'value1' } })
    })

    test('should save to local file', () => {
      expect(config.set('a.key', 'value3', true)).toBe(config)
      expect(fs.writeFileSync).toHaveBeenCalledWith(path.resolve('/Project/runtime/.aio'), hjsonFormat({ a: { key: 'value3' } }))
      expect(config.get()).toEqual({ a: { key: 'value3' } })
    })

    test('local values should have priority', () => {
      expect(config.set('a.key', 'local', true)).toBe(config)
      expect(config.set('a.key', 'global', false)).toBe(config)
      expect(fs.writeFileSync).toHaveBeenCalledWith(path.resolve('/Project/runtime/.aio'), hjsonFormat({ a: { key: 'local' } }))
      expect(config.get()).toEqual({ a: { key: 'local' } })
    })
  })

  describe('envs', () => {
    test('should set value from env', () => {
      process.env.AIO_PGB_AUTH__TOKEN = 12
      process.env.AIO_RUNTIME = 12
      process.env.AIOBAD = 12
      process.env.AIO_my__config__value = 12
      const config = new Config()
      expect(config.get()).toEqual({ pgb: { auth_token: '12' }, runtime: '12', my_config_value: '12' })
    })

    test('should override local and global settings', () => {
      const config = new Config()
      expect(config.set('pgb.name', 'local', true)).toBe(config)
      expect(config.set('pgb.name', 'global', false)).toBe(config)
      expect(config.get('pgb.name')).toBe('local')
      process.env.AIO_PGB_NAME = 'foobar'
      config.reload()
      expect(config.get('pgb.name')).toBe('foobar')
    })
  })

  describe('debugging', () => {
    test('should not fail on error', () => {
      const config = new Config()
      const mockThrowsError = jest.fn(() => {
        throw new Error('a')
      })
      fs.readFileSync = mockThrowsError

      config.reload()
      expect(mockThrowsError).toHaveBeenCalled()
    })
  })
})
