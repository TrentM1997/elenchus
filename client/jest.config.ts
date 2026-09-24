import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Transform shared TypeScript in this CommonJS test runner; production uses ESM exports.
    '^@elenchus/contracts$': '<rootDir>/../packages/contracts/src/index.ts',
    '^@elenchus/contracts/schemas/(.*)$': '<rootDir>/../packages/contracts/src/schemas/$1.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    ...tsJestTransformCfg,
  },
};

export default config;
