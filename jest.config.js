export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
  },
  moduleNameMapper: {
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
};