module.exports = {
  collectCoverageFrom: [
    "eno.js",
    "lib/**"
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testRegex: '/specs/.*\\.spec\\.js$'
};
