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

const { mkdirp, merge, getValue, setValue, loadFile, saveFile } = require('../src/util')
const path = require('path')
jest.mock('jest-plugin-fs/mock')
const fs = require('fs')
const hjson = require('hjson')

afterEach(() => {
  jest.clearAllMocks()
})

describe('loadFile', () => {
  test('is a function', () => {
    expect(loadFile).toBeInstanceOf(Function)
  })

  test('should return yaml parsed output', () => {
    fs.existsSync.mockImplementationOnce(() => true)
    fs.readFileSync.mockImplementationOnce(() => { return 'a: 12' })
    expect(loadFile('/file.yaml')).toEqual({ values: { a: 12 }, format: 'yaml' })
    expect(fs.readFileSync).toHaveBeenLastCalledWith('/file.yaml', 'utf-8')
  })

  test('should return json parsed output if json', () => {
    fs.existsSync.mockImplementationOnce(() => true)
    fs.readFileSync.mockImplementationOnce(() => { return '{ a: 12 }' })
    expect(loadFile('/file.yaml')).toEqual({ values: { a: 12 }, format: 'json' })
    expect(fs.readFileSync).toHaveBeenLastCalledWith('/file.yaml', 'utf-8')
  })

  test('should return {} if yaml parsing returns null', () => {
    fs.readFileSync.mockImplementationOnce(() => { return '' })
    expect(loadFile('/notfound')).toEqual({ values: { }, format: 'json' })
  })

  test('should throw json parsing error', () => {
    fs.readFileSync.mockImplementationOnce(() => { return '{{{{{' })
    expect(() => loadFile('/a.yaml')).toThrow(new Error('Cannot parse json'))
  })

  test('should throw yaml parsing error', () => {
    fs.readFileSync.mockImplementationOnce(() => { return 'a\n:b:\n   y-' })
    expect(() => loadFile('/a.yaml')).toThrow(new Error('Cannot parse yaml'))
  })
})

describe('saveFile', () => {
  test('is a function', () => {
    expect(saveFile).toBeInstanceOf(Function)
  })

  test('should default to empty object if null / undefined', () => {
    fs.writeFileSync.mockImplementationOnce(() => true)
    saveFile('/a/b/c/file.yaml', null)
    expect(fs.writeFileSync).toHaveBeenLastCalledWith('/a/b/c/file.yaml', '')
  })

  test('should default to empty object if empty', () => {
    fs.writeFileSync.mockImplementationOnce(() => true)
    saveFile('/a/b/c/file.yaml', {})
    expect(fs.writeFileSync).toHaveBeenLastCalledWith('/a/b/c/file.yaml', '')
  })

  test('should save yaml stringified output', () => {
    fs.writeFileSync.mockImplementationOnce(() => true)
    saveFile('/a/b/c/file.yaml', { a: 12 }, 'yaml')
    expect(fs.writeFileSync).toHaveBeenLastCalledWith('/a/b/c/file.yaml', 'a: 12\n')
  })

  test('should save json stringified output', () => {
    fs.writeFileSync.mockImplementationOnce(() => true)
    saveFile('/a/b/c/file.json', { a: 12 }, 'json')
    expect(fs.writeFileSync).toHaveBeenLastCalledWith(
      '/a/b/c/file.json',
      hjson.stringify({ a: 12 }, { condense: true, emitRootBraces: false, separator: true, bracesSameLine: true, multiline: 'off' })
    )
  })

  test('should remove leaves', () => {
    fs.writeFileSync.mockImplementationOnce(() => true)
    saveFile('/a/b/c/file.yaml', { a: 12, b: { c: { }, d: 1 } }, 'yaml')
    expect(fs.writeFileSync).toHaveBeenLastCalledWith('/a/b/c/file.yaml', 'a: 12\nb:\n  d: 1\n')
  })

  test('should remove null and empty leaves', () => {
    fs.writeFileSync.mockImplementationOnce(() => true)
    saveFile('/a/b/c/file.yaml', { a: 12, b: { c: { }, d: null } }, 'yaml')
    expect(fs.writeFileSync).toHaveBeenLastCalledWith('/a/b/c/file.yaml', 'a: 12\n')
  })
})

describe('getValue', () => {
  test('is a function', () => {
    expect(getValue).toBeInstanceOf(Function)
  })

  test('handles undefined values', () => {
    expect(getValue()).toBeUndefined()
    expect(getValue({ a: 12 })).toEqual({ a: 12 })
    expect(getValue(undefined, { a: 12 })).toEqual(undefined)
    expect(getValue(undefined, 'a')).toBeUndefined()
  })

  test('returns entire value if object', () => {
    const obj = { a: { b: 1, d: { e: 12 } } }
    expect(getValue(obj, 'a', obj)).toEqual({ b: 1, d: { e: 12 } })
  })

  test('returns single value if found', () => {
    const obj = { a: { b: 1, d: { e: 12 } } }
    expect(getValue(obj, 'a.d.e')).toEqual(12)
  })

  test('returns undefined if not found', () => {
    expect(getValue({ }, 'a.b.c.d.e')).toBeUndefined()
  })
})

describe('setValue', () => {
  test('is a function', () => {
    expect(setValue).toBeInstanceOf(Function)
  })

  test('handles undefined values', () => {
    expect(setValue('a')).toEqual({ a: undefined })
    expect(setValue()).toBeUndefined()
    expect(setValue(undefined, { a: 12 })).toEqual({ a: 12 })
  })

  test('creates object if it doesnt exist', () => {
    expect(setValue('a.b.c', 12)).toEqual({ a: { b: { c: 12 } } })
  })

  test('merges object if exists', () => {
    const obj = { a: { b: 1, d: { e: 12 } } }
    expect(setValue('a.foo', 12, obj)).toEqual({ a: { foo: 12, b: 1, d: { e: 12 } } })
  })

  test('creates object if it doesnt exist in passed in object', () => {
    const obj = { a: { b: 1, d: { e: 12 } } }
    expect(setValue('a.d.foo', { bar: 1 }, obj)).toEqual({ a: { b: 1, d: { e: 12, foo: { bar: 1 } } } })
  })

  test('replaces object if its in the way', () => {
    const obj = { a: { b: 1, d: { e: 12 } } }
    expect(setValue('a.d', 12, obj)).toEqual({ a: { b: 1, d: 12 } })
  })
})

describe('merge', () => {
  test('is a function that returns an object', () => {
    expect(merge).toBeInstanceOf(Function)
    expect(merge()).toEqual({})
  })

  test('handles null values', () => {
    expect(merge(null)).toEqual({})
    expect(merge(null, null)).toEqual({})
    expect(merge(null, { a: true }, null)).toEqual({ a: true })
  })

  test('returns a clone of all objects', () => {
    const obj = { a: true }
    expect(merge(obj) === obj).toBeFalsy()
  })

  test('last one wins', () => {
    expect(merge({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 })
  })

  test('overrides non object values 1', () => {
    expect(merge({ b: 'a' }, { b: { foo: 'bar' } })).toEqual({ b: { foo: 'bar' } })
  })

  test('overrides non object values 2', () => {
    expect(merge({ b: { foo: 'bar' } }, { b: 'a' })).toEqual({ b: 'a' })
  })

  test('overrides non object values 3', () => {
    expect(merge({ foo: 'bar' }, { foo: { a: 12 } })).toEqual({ foo: { a: 12 } })
  })

  test('replaces arrays', () => {
    expect(merge({ a: [] }, {})).toEqual({ a: [] })
    expect(merge({ a: [2] }, { a: [1] })).toEqual({ a: [1] })
  })

  test('does nested merging', () => {
    expect(merge({ a: { c: [], b: 1 } }, { a: { b: 2 } }, { a: { c: 3 } })).toEqual({ a: { b: 2, c: 3 } })
  })

  test('supports arrays properly', () => {
    expect(merge({ foo: [4, 5, 6] }, { foo: { a: [1, 2, 3] } })).toEqual({ foo: { a: [1, 2, 3] } })
  })

  test('merge should not alter objects to merge', () => {
    const g = { foo: { bar: 'abc123' } }
    const l = { foo: { bar: 'baz' } }
    const e = { abcxyz: '123456' }

    expect(merge(g, l, e)).toStrictEqual({
      abcxyz: '123456',
      foo: {
        bar: 'baz'
      }
    })
    expect(g.foo.bar).toEqual('abc123')
    expect(l.foo.bar).toEqual('baz')
    expect(e.abcxyz).toEqual('123456')
  })
})

describe('mkdirp', () => {
  test('is a function that returns an object', () => {
    expect(mkdirp).toBeInstanceOf(Function)
  })

  test('handles null (current dir)', () => {
    fs.existsSync.mockReturnValue(true)
    mkdirp(null)
    expect(fs.mkdirSync).not.toHaveBeenCalled()
    expect(fs.existsSync).toHaveBeenLastCalledWith(process.cwd() + path.sep)
  })

  test('handles blank (current dir)', () => {
    fs.existsSync.mockReturnValue(true)
    mkdirp('')
    expect(fs.mkdirSync).not.toHaveBeenCalled()
    expect(fs.existsSync).toHaveBeenLastCalledWith(process.cwd() + path.sep)
  })

  test('only creates dir if not already created', () => {
    fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false)
    mkdirp('/foo/bar')
    expect(fs.mkdirSync.mock.calls).toEqual([[path.resolve('/foo/bar') + path.sep]])
    expect(fs.existsSync).toHaveBeenLastCalledWith(path.resolve('/foo/bar') + path.sep)
  })
})
