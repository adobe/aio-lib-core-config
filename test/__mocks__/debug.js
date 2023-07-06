const mockConfig = jest.fn(() => true)

module.exports = () => mockConfig
module.exports.mock = mockConfig
