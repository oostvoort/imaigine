import type { JestConfigWithTsJest } from 'ts-jest'
import { pathsToModuleNameMapper } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  // [...]
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    // '^.+\\.tsx?$' to process js/ts with `ts-jest`
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true
      },
    ],
  },
  roots: ['<rootDir>'],
  modulePaths: ["."],
  moduleNameMapper: pathsToModuleNameMapper({
    "@/*": ["<rootDir>/src/$1"]
  }),
  transformIgnorePatterns: ['<rootDir>/node_modules'],
}

export default jestConfig
