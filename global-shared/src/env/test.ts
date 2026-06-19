import { describe, expect, it } from 'vitest'

import { parseEnvContent, readEnv, readSecretEnv } from '../index'

describe('env contracts', () => {
  it('normalizes env content and resolves runtime values before env file values', () => {
    const parsed = parseEnvContent('APP_HOST="https://example.com"\nEMPTY=\n# comment\nSERVER_PORT=43117')
    const secretEnv = readSecretEnv('missing.env', {
      existsSync: () => false,
      readFileSync: () => ''
    })

    expect(parsed).toEqual({
      APP_HOST: 'https://example.com',
      EMPTY: '',
      SERVER_PORT: '43117'
    })
    expect(secretEnv).toEqual({})
    expect(
      readEnv('APP_HOST', parsed, {
        runtimeEnv: { APP_HOST: 'https://runtime.example.com' },
        secretEnv
      })
    ).toBe('https://runtime.example.com')
  })
})
