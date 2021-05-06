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
    '@entities/(.*)': '<rootDir>/src/domain/entities/$1',
    '@usecases/(.*)': '<rootDir>/src/domain/usecases/$1',
    '@external/(.*)': '<rootDir>/src/external/$1'
  }
};
