module.exports = {
  automock: false,
  cache: false,
  collectCoverageFrom: [
    'src/games/**/*.{js,jsx}',
    'src/helpers/**/*.{js,jsx}'
  ],
  roots: [
    '<rootDir>/src',
    '<rootDir>/test',
  ],
  setupFiles: [
    './test/setup.js',
  ],
  testMatch: [
    '<rootDir>/test/**/?(*.)(spec|test).js?(x)',
  ],
  transformIgnorePatterns: [
    '/node_modules/.*',
  ],
};
