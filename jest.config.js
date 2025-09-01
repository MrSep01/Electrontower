module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/basic-functionality.test.js'
  ],
  collectCoverageFrom: [
    'index.html',
    'ion-fix-addon.js',
    'teacher-addon.js',
    'simple_test.js'
  ],
  coverageReporters: ['text', 'html', 'lcov'],
  testTimeout: 10000,
  verbose: true
};
