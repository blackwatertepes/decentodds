module.exports = {
  automock: false,
  cache: false,
  collectCoverageFrom: [
    'src/games/**/*.{js,jsx}',
    'src/helpers/**/*.{js,jsx}',
    'src/components/**/*.{vue}'
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "vue"
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
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest"
  },
  transformIgnorePatterns: [
    '/node_modules/.*',
  ],
};
