import type { Config } from 'jest';

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/graphql/(.*)$': '<rootDir>/graphql/$1',
    '^@/mocks/(.*)$': '<rootDir>/mocks/$1',
    '^@/modules/(.*)$': '<rootDir>/modules/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  preset: 'ts-jest',
};

module.exports = createJestConfig(config);
