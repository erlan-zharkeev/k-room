module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/../types'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1',
    '^entities/(.*)$': '<rootDir>/src/entities/$1',
    '^shared-config$': '<rootDir>/src/shared/config/index.ts',
    '^shared-lib$': '<rootDir>/src/shared/lib/index.ts',
    '^shared-middleware$': '<rootDir>/src/shared/middleware/index.ts',
    '^common-types$': '<rootDir>/../types/index.ts',
    '^common-types/(.*)$': '<rootDir>/../types/$1.ts'
  }
}
