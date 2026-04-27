const path = require('path')

const sharedRules = {
  '@typescript-eslint/no-unused-vars': [
    'warn',
    { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
  ],
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/strict-boolean-expressions': 'off',
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-return-await': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off',
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/space-before-function-paren': 'off',
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/member-delimiter-style': 'off',
  '@typescript-eslint/array-type': 'off',
  '@typescript-eslint/return-await': 'off',
  '@typescript-eslint/no-base-to-string': 'off',
  '@typescript-eslint/consistent-type-assertions': 'off',
  '@typescript-eslint/prefer-optional-chain': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-invalid-void-type': 'off',
  '@typescript-eslint/restrict-plus-operands': 'off',
  '@typescript-eslint/promise-function-async': 'off',
  'import/no-cycle': ['error', { maxDepth: Infinity }],
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
      pathGroups: [
        { pattern: 'global-shared', group: 'external', position: 'after' },
        { pattern: 'src/**', group: 'internal', position: 'before' }
      ],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      },
      'newlines-between': 'always'
    }
  ],
  'multiline-ternary': 'off',
  'no-useless-escape': 'off',
  'no-case-declarations': 'off',
  'array-callback-return': 'off',
  'no-extra-semi': 'off',
  'sort-imports': 'off'
}

const createTypeScriptResolver = (project, extensions = ['.js', '.ts', '.d.ts']) => ({
  'import/resolver': {
    typescript: {
      project: [path.join(__dirname, project)]
    },
    node: {
      extensions
    }
  }
})

const sharedTypeScriptOverride = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: sharedRules
}

module.exports = {
  root: true,
  ignorePatterns: ['**/*.js', '**/node_modules/**', '**/build/**', '**/dist/**', 'legacy/**'],
  overrides: [
    {
      files: ['*.cjs'],
      env: {
        es2021: true,
        node: true
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script'
      }
    },
    {
      files: ['scripts/**/*.mjs'],
      env: {
        es2021: true,
        node: true
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    {
      ...sharedTypeScriptOverride,
      files: ['server/**/*.ts'],
      env: {
        es2021: true,
        node: true
      },
      parserOptions: {
        ...sharedTypeScriptOverride.parserOptions,
        project: [path.join(__dirname, 'server/tsconfig.json'), path.join(__dirname, 'server/tsconfig.test.json')]
      },
      settings: createTypeScriptResolver('server/tsconfig.test.json')
    },
    {
      ...sharedTypeScriptOverride,
      files: ['global-shared/**/*.ts'],
      env: {
        es2021: true
      },
      parserOptions: {
        ...sharedTypeScriptOverride.parserOptions,
        project: [path.join(__dirname, 'global-shared/tsconfig.eslint.json')]
      },
      settings: createTypeScriptResolver('global-shared/tsconfig.eslint.json')
    },
    {
      ...sharedTypeScriptOverride,
      files: ['e2e/**/*.ts', 'playwright.config.ts'],
      env: {
        es2021: true,
        node: true
      },
      parserOptions: {
        ...sharedTypeScriptOverride.parserOptions,
        project: [path.join(__dirname, 'tsconfig.json')]
      },
      settings: createTypeScriptResolver('tsconfig.json')
    },
    {
      ...sharedTypeScriptOverride,
      files: ['client/*.config.ts', 'client/env.ts', 'client/env.types.ts'],
      env: {
        es2021: true,
        node: true
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts', '.d.ts']
          }
        }
      }
    },
    {
      ...sharedTypeScriptOverride,
      files: ['client/src/**/*.ts'],
      env: {
        es2021: true,
        browser: true
      },
      parserOptions: {
        ...sharedTypeScriptOverride.parserOptions
      },
      settings: createTypeScriptResolver('client/tsconfig.eslint.json', ['.js', '.ts', '.d.ts', '.vue'])
    },
    {
      ...sharedTypeScriptOverride,
      files: ['client/src/**/*.vue'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/essential'],
      env: {
        es2021: true,
        browser: true
      },
      parser: 'vue-eslint-parser',
      parserOptions: {
        ...sharedTypeScriptOverride.parserOptions,
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue']
      },
      plugins: ['@typescript-eslint', 'import', 'vue'],
      settings: createTypeScriptResolver('client/tsconfig.eslint.json', ['.js', '.ts', '.d.ts', '.vue']),
      rules: {
        ...sharedRules,
        'vue/multi-word-component-names': 'off'
      }
    },
    {
      files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.vue', '**/*.test.vue'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}
