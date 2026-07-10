import { describe, expect, it, vi } from 'vitest'

vi.mock('src/shared/lib', () => ({
  captureClientSentryMessage: vi.fn(),
  withClientSentryScope: vi.fn()
}))
vi.stubGlobal('__CLIENT_ENV_DATA__', { appName: 'K-Room Test' })

const { buildRoomCallSelectedCandidatePairDiagnostics } = await import('./room-call-sentry-diagnostics')

describe('room call Sentry diagnostics', () => {
  it('captures selected ICE route types without collecting candidate addresses', () => {
    const stats = new Map<string, Record<string, unknown>>([
      ['transport-1', { id: 'transport-1', type: 'transport', selectedCandidatePairId: 'pair-1' }],
      [
        'pair-1',
        {
          currentRoundTripTime: 0.15,
          id: 'pair-1',
          localCandidateId: 'local-1',
          remoteCandidateId: 'remote-1',
          state: 'succeeded',
          type: 'candidate-pair'
        }
      ],
      [
        'local-1',
        {
          address: '192.0.2.1',
          candidateType: 'relay',
          id: 'local-1',
          protocol: 'udp',
          relayProtocol: 'tls',
          type: 'local-candidate'
        }
      ],
      [
        'remote-1',
        {
          address: '198.51.100.1',
          candidateType: 'srflx',
          id: 'remote-1',
          protocol: 'udp',
          type: 'remote-candidate'
        }
      ]
    ]) as unknown as RTCStatsReport

    const diagnostics = buildRoomCallSelectedCandidatePairDiagnostics(stats)

    expect(diagnostics).toMatchObject({
      present: true,
      currentRoundTripTime: 0.15,
      localCandidate: {
        candidateType: 'relay',
        protocol: 'udp',
        relayProtocol: 'tls'
      },
      remoteCandidate: {
        candidateType: 'srflx',
        protocol: 'udp'
      },
      state: 'succeeded'
    })
    expect(JSON.stringify(diagnostics)).not.toContain('192.0.2.1')
    expect(JSON.stringify(diagnostics)).not.toContain('198.51.100.1')
  })
})
