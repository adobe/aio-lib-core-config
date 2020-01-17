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

const mockGet = jest.fn(() => 12)
const mockReload = jest.fn(() => true)
const mockSet = jest.fn(() => true)

jest.mock('../src/Config', () => {
  return jest.fn().mockImplementation(() => {
    return { get: mockGet, reload: mockReload, set: mockSet }
  })
})

const config = require('../src/index.js')

afterEach(() => {
  jest.clearAllMocks()
})

describe('Index', () => {
  test('should return object', () => {
    expect(typeof config.get).toEqual('function')
    expect(typeof config.set).toEqual('function')
    expect(typeof config.delete).toEqual('function')
  })

  describe('methods', () => {
    test('get without args', () => {
      config.get()
      expect(mockGet).toHaveBeenCalledWith(undefined, undefined)
    })

    test('get', () => {
      config.get('akey')
      expect(mockGet).toHaveBeenCalledWith('akey', undefined)
    })

    test('get local', () => {
      config.get('akey', true)
      expect(mockGet).toHaveBeenCalledWith('akey', true)
    })

    test('set', () => {
      expect(config.set('akey', { a: 12 })).toBe(config)
      expect(mockSet).toHaveBeenCalledWith('akey', { a: 12 }, undefined)
    })

    test('set without key', () => {
      expect(config.set(undefined, { a: 12 })).toBe(config)
      expect(mockSet).toHaveBeenCalledWith(undefined, { a: 12 }, undefined)
    })

    test('set local', () => {
      expect(config.set(undefined, { a: 12 }, true)).toBe(config)
      expect(mockSet).toHaveBeenCalledWith(undefined, { a: 12 }, true)
    })

    test('delete', () => {
      expect(config.delete('akey')).toBe(config)
      expect(mockSet).toHaveBeenCalledWith('akey', null, undefined)
    })

    test('delete with no args', () => {
      expect(config.delete()).toBe(config)
      expect(mockSet).toHaveBeenCalledWith(undefined, null, undefined)
    })

    test('delete local', () => {
      expect(config.delete('akey', true)).toBe(config)
      expect(mockSet).toHaveBeenCalledWith('akey', null, true)
    })

    test('reload', () => {
      expect(config.reload()).toBe(config)
      expect(mockReload).toHaveBeenCalledWith()
    })

    test('getPipedData', () => {
      expect(typeof config.getPipedData).toEqual('function')
    })

    test('dotenv', () => {
      expect(typeof config.dotenv).toEqual('function')
    })
  })
})
