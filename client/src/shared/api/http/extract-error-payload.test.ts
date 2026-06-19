import { describe, expect, it } from 'vitest'

import { extractErrorPayload } from './extract-error-payload'

describe('extractErrorPayload', () => {
  it('extracts backend error payload from json blob responses', async () => {
    const payload = {
      message: {
        text: 'Failed',
        silent: false
      },
      payload: {
        code: 'bad'
      }
    }
    const error = {
      response: {
        data: new Blob([JSON.stringify(payload)], {
          type: 'application/json'
        })
      }
    }

    await expect(extractErrorPayload(error as never)).resolves.toEqual(payload)
  })
})
