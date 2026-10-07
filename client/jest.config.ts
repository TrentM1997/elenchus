import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({
  diagnostics: {
    ignoreCodes: [1343],
  },
  astTransformers: {
    before: [
      {
        path: "ts-jest-mock-import-meta",
        options: {
          metaObjectReplacement: {
            env: {
              PUBLIC_API_ORIGIN: "",
            },
          },
        },
      },
    ],
  },
}).transform;

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@elenchus/contracts$": "<rootDir>/../packages/contracts/src/index.ts",
    "^@elenchus/contracts/schemas/(.*)$":
      "<rootDir>/../packages/contracts/src/schemas/$1.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    ...tsJestTransformCfg,
  },
};

export default config;
