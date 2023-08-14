const pipe = require('../src/pipe')
const status = Symbol.for('aio-cli-config.pipe')

describe('piped data', () => {
  let stdin

  beforeAll(() => { stdin = require('mock-stdin').stdin() })
  beforeEach(() => stdin.reset())
  afterAll(() => stdin.restore())
  afterEach(() => { global[status] = undefined })

  test('should parse piped data', () => {
    return new Promise((resolve, reject) => {
      pipe().then(res => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(res).toEqual('{"foo": "bar"}')
        resolve()
      }).catch(reject)

      stdin.send('{"foo": "bar"}')
      stdin.end()
    })
  })

  test('should allow empty input', () => {
    return new Promise((resolve, reject) => {
      pipe().then((res) => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(res).toEqual('')
        resolve()
      }).catch(reject)

      stdin.send('')
      stdin.end()
    })
  })

  test('should return value if not valid yaml or json', () => {
    return new Promise((resolve, reject) => {
      pipe().then((res) => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(res).toEqual('playing_playlist: {{ action }} playlist {{ playlist_name }}')
        resolve()
      }).catch(reject)

      stdin.send('playing_playlist: {{ action }} playlist {{ playlist_name }}')
      stdin.end()
    })
  })
})

describe('tty', () => {
  test('should return undefined if no piped data present', () => {
    return new Promise((resolve, reject) => {
      process.stdin.isTTY = true
      pipe().then(res => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(res).toEqual(undefined)
        resolve()
      }).catch(reject)
    })
  })
})
