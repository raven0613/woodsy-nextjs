import type {Config} from 'jest';
import {defaults} from 'jest-config';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config: Config = {
  // moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts', "js", "mjs", "cjs", "jsx", "ts", "tsx", "json", "node"],
  // preset: 'ts-jest',
  // transform: {
  //   '^.+\\.(ts|tsx)?$': 'ts-jest',
  //   "^.+\\.(js|jsx)$": "babel-jest",
  // },
  // moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom'
};

export default createJestConfig(config);


