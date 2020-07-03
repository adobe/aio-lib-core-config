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

const dotenv = require('../src/dotenv')
const fs = require('fs')
const path = require('path')
const debug = require('debug').mock
const envFile = Symbol.for('aio-cli-config.envfile')
const envVars = Symbol.for('aio-cli-config.envVars')
let processenv, processcwd
jest.spyOn(fs, 'readFileSync')

beforeAll(() => {
  fs.mkdirSync('/project/')
})

beforeEach(() => {
  processenv = process.env
  processcwd = process.cwd
  process.cwd = () => path.resolve('/project')
})

afterEach(() => {
  jest.clearAllMocks()
  process.env = processenv
  process.cwd = processcwd
  delete global[envFile]
  delete global[envVars]
})

test('is a function', () => expect(dotenv).toBeInstanceOf(Function))

test('if file doesnt exist no change to process.env', () => {
  dotenv()
  expect(process.env).toEqual(processenv)
  expect(global[envFile]).toEqual(path.resolve('/project/.env'))
  expect(fs.readFileSync).toHaveBeenCalled()
})

test('should set global symbol', () => {
  global[envFile] = undefined
  dotenv()
  expect(global[envFile]).toEqual(path.resolve('/project/.env'))
  expect(fs.readFileSync).toHaveBeenCalled()
})

test('shouldnt do anything if global symbol is present', () => {
  global[envFile] = path.resolve('/project/.env')
  dotenv()
  expect(process.env).toEqual(processenv)
  expect(fs.readFileSync).not.toHaveBeenCalled()
})

test('shouldnt do anything if global symbol is present (unless forced)', () => {
  global[envFile] = path.resolve('/project/.env')
  dotenv(true)
  expect(process.env).toEqual(processenv)
  expect(fs.readFileSync).toHaveBeenCalled()
})

describe(('error handling'), () => {
  beforeEach(() => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('an error') })
  })

  afterEach(() => {
    fs.readFileSync.mockRestore()
  })

  test('should not fail on read error', () => {
    fs.writeFileSync('/project/.env', fixtureFile('empty'))
    dotenv()
    expect(debug).toHaveBeenNthCalledWith(1, `cannot read environment variables from ${path.join(process.cwd(), '.env')}`)
    expect(debug).toHaveBeenNthCalledWith(2, ' - Error: an error')
    expect(debug).toHaveBeenLastCalledWith('skipping ...')
  })
})

describe('clear', () => {
  afterEach(() => {
    fs.unlinkSync('/project/.env')
  })

  test('should clear existing envVars', () => {
    fs.writeFileSync('/project/.env', fixtureFile('single'))
    dotenv()
    expect(process.env).toEqual({ ...{ A: '12', B: '12', C: '12' }, ...processenv })
    fs.writeFileSync('/project/.env', fixtureFile('empty'))
    dotenv(true)
    expect(process.env).toEqual(processenv)
  })
})

describe('parse', () => {
  afterEach(() => {
    fs.unlinkSync('/project/.env')
  })

  test('empty', () => {
    fs.writeFileSync('/project/.env', fixtureFile('empty'))
    dotenv()
    expect(process.env).toEqual(processenv)
  })

  test('empty values', () => {
    fs.writeFileSync('/project/.env', fixtureFile('empty_values'))
    dotenv()
    expect(process.env.A).toEqual('')
    expect(process.env.B).toEqual('')
    expect(process.env.C).toEqual('')
    expect(process.env.D).toEqual('')
  })

  test('comment', () => {
    fs.writeFileSync('/project/.env', fixtureFile('comment'))
    dotenv()
    expect(process.env).toEqual({ ...{ E: '5' }, ...processenv })
    expect(debug).toHaveBeenLastCalledWith('added environment variable(s): E')
    expect(global[envVars]).toEqual(['E'])
  })

  test('quotes', () => {
    fs.writeFileSync('/project/.env', fixtureFile('quotes'))
    dotenv()
    expect(process.env).toEqual({
      ...{
        A: '   12\'\'  \\n',
        B: '   12"" \n',
        C: '   12  \n'
      },
      ...processenv
    })
    expect(debug).toHaveBeenLastCalledWith('added environment variable(s): A, B, C')
    expect(global[envVars]).toEqual(['A', 'B', 'C'])
  })

  test('single', () => {
    fs.writeFileSync('/project/.env', fixtureFile('single'))
    dotenv()
    expect(process.env).toEqual({ ...{ A: '12', B: '12', C: '12' }, ...processenv })
    expect(debug).toHaveBeenLastCalledWith('added environment variable(s): A, B, C')
    expect(global[envVars]).toEqual(['A', 'B', 'C'])
  })
})

test('should not overwrite process.env values', () => {
  process.env.A = 12
  fs.writeFileSync('/project/.env', 'A=1\nB=12')
  dotenv()
  expect(process.env.B).toEqual('12')
  expect(process.env.A).toEqual('12')
})
