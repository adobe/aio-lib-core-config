const fs = jest.requireActual('fs')

// mock fs so no tests accidently write to disk
jest.mock('fs', () => require('jest-plugin-fs/mock'))
process.on('unhandledRejection', console.error)

// helper for fixtures
global.fixtureFile = (output) => {
  return fs.readFileSync(`./test/__fixtures__/${output}`).toString()
}
