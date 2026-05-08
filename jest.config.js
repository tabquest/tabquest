export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      configFile: './babel.config.json',
    }],
  },
  moduleNameMapper: {
    '\\.(css|scss|less)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/jest/fileMock.js',
    '^lucide-react$': '<rootDir>/jest/lucideMock.js',
    '^react-markdown$': '<rootDir>/jest/markdownMock.js',
    '^remark-gfm$': '<rootDir>/jest/remarkMock.js',
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.test.{js,jsx,ts,tsx}'],
};
