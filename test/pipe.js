const pipe = require('../src/pipe')
const status = Symbol.for('aio-cli-config.pipe')

describe('piped data', () => {
  let stdin

  beforeAll(() => { stdin = require('mock-stdin').stdin() })
  beforeEach(() => stdin.reset())
  afterAll(() => stdin.restore())
  afterEach(() => { global[status] = undefined })

  test('should parse piped data', (done) => {
    pipe().then(res => {
      expect(res).toEqual('{"foo": "bar"}')
      done()
    }).catch(done.fail)

    stdin.send('{"foo": "bar"}')
    stdin.end()
  })

  test('should allow empty input', (done) => {
    pipe().then((res) => {
      expect(res).toEqual('')
      done()
    }).catch(done.fail)

    stdin.send('')
    stdin.end()
  })

  test('should return value if not valid yaml or json', (done) => {
    pipe().then((res) => {
      expect(res).toEqual('playing_playlist: {{ action }} playlist {{ playlist_name }}')
      done()
    }).catch(done.fail)

    stdin.send('playing_playlist: {{ action }} playlist {{ playlist_name }}')
    stdin.end()
  })
})

describe('tty', () => {
  test('should return undefined if no piped data present', (done) => {
    process.stdin.isTTY = true
    pipe().then(res => {
      expect(res).toEqual(undefined)
      done()
    }).catch(done.fail)
  })
})
