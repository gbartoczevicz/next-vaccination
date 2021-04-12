/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* eslint-disable quotes */
const { resolve } = require('path');
const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(A-Za-z)-entities/(.*)': '<rootDir>/src/modules/$1/entities/$2',
    '@/(A-Za-z)-usecases/(.*)': '<rootDir>/src/modules/$1/usecases/$2',
    '@/(A-Za-z)-infra/(.*)': '<rootDir>/src/modules/$1/infra/$2',
    '@/(A-Za-z)-adapters/(.*)': '<rootDir>/src/modules/$1/adapters/$2',
    '@/(A-Za-z)-main/(.*)': '<rootDir>/src/modules/$1/main/$2'
  }
};
