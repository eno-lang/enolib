module.exports = {
  collectCoverageFrom: ["lib/**"],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testRegex: '/specs/.*\\.spec\\.js$'
};
