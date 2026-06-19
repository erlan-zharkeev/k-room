import { describe, expect, it } from 'vitest'

import { parseDownloadReleasesManifest } from './parse-download-releases-manifest'

describe('parseDownloadReleasesManifest', () => {
  it('parses download manifest platforms in stable order', () => {
    expect(
      parseDownloadReleasesManifest({
        releasedAt: '2026-06-15',
        platforms: {
          macos: {
            label: 'Mac',
            fileName: 'K-Room.dmg',
            downloadUrl: '/downloads/K-Room.dmg'
          },
          windows: {
            label: 'PC',
            fileName: 'K-Room-Setup.exe',
            downloadUrl: '/downloads/K-Room-Setup.exe'
          }
        }
      })
    ).toEqual({
      releasedAt: '2026-06-15',
      platformItems: [
        {
          platformId: 'windows',
          label: 'PC',
          fileName: 'K-Room-Setup.exe',
          downloadUrl: '/downloads/K-Room-Setup.exe'
        },
        {
          platformId: 'macos',
          label: 'Mac',
          fileName: 'K-Room.dmg',
          downloadUrl: '/downloads/K-Room.dmg'
        }
      ]
    })
  })

  it('rejects manifest without every required platform', () => {
    expect(
      parseDownloadReleasesManifest({
        releasedAt: '2026-06-15',
        platforms: {
          windows: {
            label: 'PC',
            fileName: 'K-Room-Setup.exe',
            downloadUrl: '/downloads/K-Room-Setup.exe'
          }
        }
      })
    ).toBeNull()
  })
})
