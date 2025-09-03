module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'study.html',
    'index.html',
    'progress.html'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true
};