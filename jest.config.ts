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
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/components/', // Exclude components directory from coverage
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  preset: 'ts-jest',
  transformIgnorePatterns: [
    '/node_modules',
    '/node_modules/(?!@fullcalendar/*).+\\.[t|j]sx?$',
    '/node_modules/(?!uuid|short-uuid)/',
  ],
  testEnvironmentOptions: {
    customExportConditions: [],
  },
};

module.exports = createJestConfig(config);
