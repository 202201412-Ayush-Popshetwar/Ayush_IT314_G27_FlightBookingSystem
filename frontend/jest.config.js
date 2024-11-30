export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__tests__/mocks/fileMock.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    'react-toastify/dist/ReactToastify.css': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^../utils/airlineLogos$': '<rootDir>/src/utils/airlineLogos.js'
  },
  modulePaths: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: [
    '<rootDir>/src/__tests__/setup/setup.js',
    '<rootDir>/src/__tests__/setup/envSetup.js'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: ['**/__tests__/**/*.test.(js|jsx)'],
  moduleFileExtensions: ['js', 'jsx'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'html', 'lcov', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(@mui|@babel|@testing-library|react-toastify)/)'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['']
  },
  roots: ['<rootDir>/src']
};
