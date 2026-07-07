import { expect, test, type Browser, type BrowserContext, type Locator, type Page } from '@playwright/test'

import { E2E_ENV } from 'e2e/config'
import { dismissFirstRunOverlays } from 'e2e/shared/app'
import { loginByCredentials } from 'e2e/shared/auth'

import {
  ROOM_CALL_E2E_DEVICE_IDS,
  ROOM_CALL_E2E_DEVICE_LABELS,
  ROOM_CALL_E2E_DEVICE_OPTION_LABELS,
  ROOM_CALL_E2E_GROUP_CHAT_NAME,
  ROOM_CALL_E2E_LABELS,
  ROOM_CALL_E2E_RTP_TIMEOUT_MS,
  ROOM_CALL_E2E_STORED_CALL_DIAGNOSTIC_LIMIT,
  ROOM_CALL_E2E_STORED_CALL_DIAGNOSTIC_WINDOW_MS,
  ROOM_CALL_E2E_SYNC_TIMEOUT_MS,
  ROOM_CALL_E2E_TEST_TIMEOUT_MS,
  ROOM_CALL_E2E_USERS
} from './constants'
import type { RoomCallE2EMediaSnapshot, RoomCallE2ESession, RoomCallE2EUser } from './types'

const installRoomCallMediaMocks = async (context: BrowserContext) => {
  await context.addInitScript(() => {
    const mediaDevices = [
      {
        deviceId: 'default',
        groupId: 'e2e-audio-group',
        kind: 'audioinput',
        label: 'Default microphone',
        toJSON() {
          return this
        }
      },
      {
        deviceId: 'e2e-audio-input-2',
        groupId: 'e2e-audio-group-2',
        kind: 'audioinput',
        label: 'External microphone',
        toJSON() {
          return this
        }
      },
      {
        deviceId: 'default',
        groupId: 'e2e-video-group',
        kind: 'videoinput',
        label: 'Front camera',
        toJSON() {
          return this
        }
      },
      {
        deviceId: 'e2e-video-input-2',
        groupId: 'e2e-video-group-2',
        kind: 'videoinput',
        label: 'Rear camera',
        toJSON() {
          return this
        }
      },
      {
        deviceId: 'default',
        groupId: 'e2e-output-group',
        kind: 'audiooutput',
        label: 'Default speaker',
        toJSON() {
          return this
        }
      },
      {
        deviceId: 'e2e-audio-output-2',
        groupId: 'e2e-output-group-2',
        kind: 'audiooutput',
        label: 'External speaker',
        toJSON() {
          return this
        }
      }
    ]
    const state = {
      displayMediaCalls: [] as unknown[],
      getUserMediaCalls: [] as unknown[],
      mediaObjects: [] as unknown[],
      peerConnections: [] as RTCPeerConnection[],
      setSinkIdCalls: [] as string[]
    }
    const serialize = (value: unknown) => JSON.parse(JSON.stringify(value ?? null))
    const resolveConstraintValue = (constraint: unknown, fallback: string) => {
      if (!constraint || typeof constraint === 'boolean') {
        return fallback
      }

      if (typeof constraint === 'string') {
        return constraint
      }

      if (typeof constraint !== 'object') {
        return fallback
      }

      const data = constraint as Record<string, unknown>
      const exact = data.exact
      const ideal = data.ideal

      return typeof exact === 'string' ? exact : typeof ideal === 'string' ? ideal : fallback
    }
    const resolveAudioDeviceId = (constraints: MediaStreamConstraints) => {
      const audio = constraints.audio

      return resolveConstraintValue(typeof audio === 'object' ? audio.deviceId : undefined, 'default')
    }
    const resolveVideoDetails = (constraints: MediaStreamConstraints) => {
      const video = constraints.video
      const deviceId = resolveConstraintValue(typeof video === 'object' ? video.deviceId : undefined, 'default')
      const facingMode = resolveConstraintValue(typeof video === 'object' ? video.facingMode : undefined, '')

      return {
        deviceId,
        facingMode: facingMode || (deviceId === 'e2e-video-input-2' ? 'environment' : 'user')
      }
    }
    const attachTrackSettings = (
      track: MediaStreamTrack,
      settings: Pick<MediaTrackSettings, 'deviceId' | 'facingMode'>
    ) => {
      const nativeGetSettings = track.getSettings.bind(track)

      Object.defineProperty(track, 'getSettings', {
        configurable: true,
        value: () => ({
          ...nativeGetSettings(),
          ...settings
        })
      })
    }
    const createAudioTrack = (deviceId: string) => {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext
      const audioContext = new AudioContextCtor()
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      const destination = audioContext.createMediaStreamDestination()

      oscillator.frequency.value = deviceId === 'e2e-audio-input-2' ? 660 : 440
      gain.gain.value = 0.05
      oscillator.connect(gain)
      gain.connect(destination)
      oscillator.start()
      void audioContext.resume()

      const [track] = destination.stream.getAudioTracks()

      attachTrackSettings(track, { deviceId })
      state.mediaObjects.push(audioContext, oscillator, gain, destination)

      return track
    }
    const createVideoTrack = (deviceId: string, facingMode: string, label: string) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = 320
      canvas.height = 180

      let frame = 0
      const intervalId = window.setInterval(() => {
        if (!context) {
          return
        }

        frame += 1
        context.fillStyle = `hsl(${(frame * 17) % 360} 70% 42%)`
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = '#ffffff'
        context.font = '24px sans-serif'
        context.fillText(label, 24, 92)
      }, 100)
      const stream = canvas.captureStream(10)
      const [track] = stream.getVideoTracks()

      attachTrackSettings(track, { deviceId, facingMode: facingMode as MediaTrackSettings['facingMode'] })
      track.addEventListener(
        'ended',
        () => {
          window.clearInterval(intervalId)
        },
        { once: true }
      )
      state.mediaObjects.push(canvas, stream)

      return track
    }
    const createUserMediaStream = (constraints: MediaStreamConstraints) => {
      const stream = new MediaStream()

      if (constraints.audio) {
        stream.addTrack(createAudioTrack(resolveAudioDeviceId(constraints)))
      }

      if (constraints.video) {
        const { deviceId, facingMode } = resolveVideoDetails(constraints)

        stream.addTrack(createVideoTrack(deviceId, facingMode, deviceId === 'e2e-video-input-2' ? 'rear' : 'front'))
      }

      return stream
    }
    const mediaDevicesApi = navigator.mediaDevices ?? {}

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: mediaDevicesApi
    })

    Object.defineProperty(mediaDevicesApi, 'enumerateDevices', {
      configurable: true,
      value: async () => mediaDevices
    })
    Object.defineProperty(mediaDevicesApi, 'getUserMedia', {
      configurable: true,
      value: async (constraints: MediaStreamConstraints) => {
        state.getUserMediaCalls.push(serialize(constraints))

        return createUserMediaStream(constraints)
      }
    })
    Object.defineProperty(mediaDevicesApi, 'getDisplayMedia', {
      configurable: true,
      value: async (constraints: MediaStreamConstraints) => {
        state.displayMediaCalls.push(serialize(constraints))

        const stream = new MediaStream()

        stream.addTrack(createVideoTrack('e2e-screen', 'environment', 'screen'))

        return stream
      }
    })

    const nativeSetSinkId = HTMLMediaElement.prototype.setSinkId

    Object.defineProperty(HTMLMediaElement.prototype, 'setSinkId', {
      configurable: true,
      value: async function setSinkId(deviceId: string) {
        state.setSinkIdCalls.push(deviceId)

        if (nativeSetSinkId) {
          return nativeSetSinkId.call(this, deviceId)
        }
      }
    })

    const NativeRTCPeerConnection = window.RTCPeerConnection
    const PeerConnectionMock = function RTCPeerConnectionMock(
      this: RTCPeerConnection,
      ...args: ConstructorParameters<typeof RTCPeerConnection>
    ) {
      const peerConnection = new NativeRTCPeerConnection(...args)

      state.peerConnections.push(peerConnection)

      return peerConnection
    }

    PeerConnectionMock.prototype = NativeRTCPeerConnection.prototype
    Object.setPrototypeOf(PeerConnectionMock, NativeRTCPeerConnection)
    window.RTCPeerConnection = PeerConnectionMock as unknown as typeof RTCPeerConnection

    window.__roomCallE2e = {
      snapshot: async () => {
        const peerConnections = await Promise.all(
          state.peerConnections.map(async (peerConnection) => {
            const stats = await peerConnection.getStats()
            const snapshot = {
              bytesReceived: 0,
              bytesSent: 0,
              connectionState: peerConnection.connectionState,
              iceConnectionState: peerConnection.iceConnectionState,
              inboundAudioPackets: 0,
              inboundVideoPackets: 0,
              outboundAudioPackets: 0,
              outboundVideoPackets: 0,
              signalingState: peerConnection.signalingState
            }

            stats.forEach((report) => {
              const data = report as RTCStats & {
                bytesReceived?: number
                bytesSent?: number
                kind?: string
                mediaType?: string
                packetsReceived?: number
                packetsSent?: number
              }
              const kind = data.kind ?? data.mediaType

              if (data.type === 'inbound-rtp') {
                snapshot.bytesReceived += data.bytesReceived ?? 0

                if (kind === 'audio') {
                  snapshot.inboundAudioPackets += data.packetsReceived ?? 0
                }

                if (kind === 'video') {
                  snapshot.inboundVideoPackets += data.packetsReceived ?? 0
                }
              }

              if (data.type === 'outbound-rtp') {
                snapshot.bytesSent += data.bytesSent ?? 0

                if (kind === 'audio') {
                  snapshot.outboundAudioPackets += data.packetsSent ?? 0
                }

                if (kind === 'video') {
                  snapshot.outboundVideoPackets += data.packetsSent ?? 0
                }
              }
            })

            return snapshot
          })
        )

        return {
          displayMediaCalls: state.displayMediaCalls,
          getUserMediaCalls: state.getUserMediaCalls,
          peerConnections,
          setSinkIdCalls: state.setSinkIdCalls
        }
      }
    }
  })
}

const createRoomCallSession = async (browser: Browser, user: RoomCallE2EUser): Promise<RoomCallE2ESession> => {
  const context = await browser.newContext({
    baseURL: E2E_ENV.PLAYWRIGHT_BASE_URL,
    ignoreHTTPSErrors: true
  })

  await context.grantPermissions(['camera', 'microphone'], { origin: E2E_ENV.PLAYWRIGHT_BASE_URL })
  await installRoomCallMediaMocks(context)

  const page = await context.newPage()

  await loginByCredentials(page, user.email, user.password)

  return { context, page, user }
}

const getChatRoomRow = (page: Page, title: string) =>
  page.locator('.chat-room-list-item').filter({ has: page.locator('.chat-room-list-item__name').getByText(title) })

const openFixtureGroupChat = async (page: Page) => {
  await page.goto('/app/chat-rooms')
  await dismissFirstRunOverlays(page)
  await expect(page.getByPlaceholder('Search chat')).toBeVisible()

  const row = getChatRoomRow(page, ROOM_CALL_E2E_GROUP_CHAT_NAME)

  await expect(row).toBeVisible()
  await row.locator('.chat-room-list-item__link').click()
  await expect(page).toHaveURL(/\/app\/chat-rooms\/[^/?]+/)
  await expect(page.getByRole('heading', { name: ROOM_CALL_E2E_GROUP_CHAT_NAME })).toBeVisible()
}

const clickControl = async (root: Page | Locator, name: string) => {
  const control = root.locator(`[aria-label="${name}"]:visible`).first()
  const button = control.locator('button').first()

  await expect(control).toBeVisible({ timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })

  if (await button.count()) {
    await expect(button).toBeEnabled({ timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })
    await button.click({ timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })
    return
  }

  await control.click({ timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })
}

const clickRoomCallPanelControl = async (page: Page, name: string) => {
  await clickControl(page.locator('.room-call-panel__bottom').first(), name)
}

const ensureGridView = async (page: Page) => {
  const panelBottom = page.locator('.room-call-panel__bottom').first()
  const switchToGridView = panelBottom.locator(`[aria-label="${ROOM_CALL_E2E_LABELS.gridView}"]`).first()

  if (await switchToGridView.isVisible()) {
    await clickRoomCallPanelControl(page, ROOM_CALL_E2E_LABELS.gridView)
    return
  }

  await expect(panelBottom.locator(`[aria-label="${ROOM_CALL_E2E_LABELS.focusView}"]`).first()).toBeVisible()
}

const readRoomCallMediaSnapshot = (page: Page) =>
  page.evaluate(async () => window.__roomCallE2e?.snapshot()) as Promise<RoomCallE2EMediaSnapshot>

const readStoredRoomCalls = (page: Page) =>
  page.evaluate(
    async ({ diagnosticLimit, diagnosticWindowMs }) => {
      const databaseNames = await indexedDB.databases?.()
      const databaseName = databaseNames?.find(({ name }) => name?.toLowerCase().includes('k-room'))?.name ?? 'k-room'

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const database = request.result
          const transaction = database.transaction('room-calls', 'readonly')
          const store = transaction.objectStore('room-calls')
          const getAllRequest = store.getAll()

          getAllRequest.onerror = () => {
            database.close()
            reject(getAllRequest.error)
          }
          getAllRequest.onsuccess = () => {
            database.close()
            const now = Date.now()
            const result = getAllRequest.result as Array<{ calledAt?: number; finishedAt?: number; status?: string }>
            const recentOrActiveRoomCalls = result
              .filter((roomCall) => {
                const calledAt = roomCall.calledAt ?? 0
                const isRecent = now - calledAt < diagnosticWindowMs
                const isActive = roomCall.status !== 'finished' && !roomCall.finishedAt

                return isRecent || isActive
              })
              .sort((left, right) => (right.calledAt ?? 0) - (left.calledAt ?? 0))
              .slice(0, diagnosticLimit)

            resolve(recentOrActiveRoomCalls)
          }
        }
      })
    },
    {
      diagnosticLimit: ROOM_CALL_E2E_STORED_CALL_DIAGNOSTIC_LIMIT,
      diagnosticWindowMs: ROOM_CALL_E2E_STORED_CALL_DIAGNOSTIC_WINDOW_MS
    }
  )

const readVisibleAriaLabels = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('[aria-label]'))
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        const style = window.getComputedStyle(element)

        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
      })
      .map((element) => element.getAttribute('aria-label'))
  )

const waitForRoomCallStart = async (initiator: RoomCallE2ESession, invitees: RoomCallE2ESession[]) => {
  const startButton = initiator.page.locator(`[aria-label="${ROOM_CALL_E2E_LABELS.startVideoCall}"] button`).first()
  const deadline = Date.now() + ROOM_CALL_E2E_SYNC_TIMEOUT_MS
  let lastDiagnostic: unknown = null

  while (Date.now() < deadline) {
    const hasInitiatorActivity = await initiator.page
      .locator('.call-activity-panel, .room-call-panel')
      .first()
      .isVisible()
    const inviteeJoinVisibility = await Promise.all(
      invitees.map(({ page }) =>
        page.locator(`[aria-label="${ROOM_CALL_E2E_LABELS.joinVideo}"]:visible`).first().isVisible()
      )
    )

    if (hasInitiatorActivity && inviteeJoinVisibility.every(Boolean)) {
      return
    }

    const snapshot = await readRoomCallMediaSnapshot(initiator.page).catch(() => null)
    const storedRoomCalls = await readStoredRoomCalls(initiator.page).catch(() => null)
    const visibleAriaLabels = await Promise.all(
      [initiator, ...invitees].map(({ page }) => readVisibleAriaLabels(page).catch(() => []))
    )
    const startButtonLoading = await startButton.getAttribute('loading', { timeout: 100 }).catch(() => null)
    const startButtonDisabled = await startButton.isDisabled({ timeout: 100 }).catch(() => null)

    lastDiagnostic = {
      getUserMediaCalls: snapshot?.getUserMediaCalls ?? null,
      hasInitiatorActivity,
      inviteeJoinVisibility,
      startButtonDisabled,
      startButtonLoading,
      storedRoomCalls,
      visibleAriaLabels
    }

    if (Date.now() >= deadline) {
      break
    }

    await initiator.page.waitForTimeout(500)
  }

  throw new Error(JSON.stringify(lastDiagnostic, null, 2))
}

const waitForParticipantTiles = async (page: Page, quantity: number) => {
  await expect(page.locator('.room-call-tile')).toHaveCount(quantity, { timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })
}

const hasConnectedPeerConnections = (snapshot: RoomCallE2EMediaSnapshot, expectedPeerQuantity: number) => {
  const connectedStates = new Set<RTCPeerConnectionState>(['connected'])
  const connectedIceStates = new Set<RTCIceConnectionState>(['connected', 'completed'])
  const connectedPeerConnections = snapshot.peerConnections.filter(
    ({ connectionState, iceConnectionState }) =>
      connectedStates.has(connectionState) || connectedIceStates.has(iceConnectionState)
  )

  return connectedPeerConnections.length >= expectedPeerQuantity
}

const hasTwoWayRtp = (snapshot: RoomCallE2EMediaSnapshot) => {
  const total = snapshot.peerConnections.reduce(
    (acc, peerConnection) => ({
      bytesReceived: acc.bytesReceived + peerConnection.bytesReceived,
      bytesSent: acc.bytesSent + peerConnection.bytesSent,
      inboundAudioPackets: acc.inboundAudioPackets + peerConnection.inboundAudioPackets,
      inboundVideoPackets: acc.inboundVideoPackets + peerConnection.inboundVideoPackets,
      outboundAudioPackets: acc.outboundAudioPackets + peerConnection.outboundAudioPackets,
      outboundVideoPackets: acc.outboundVideoPackets + peerConnection.outboundVideoPackets
    }),
    {
      bytesReceived: 0,
      bytesSent: 0,
      inboundAudioPackets: 0,
      inboundVideoPackets: 0,
      outboundAudioPackets: 0,
      outboundVideoPackets: 0
    }
  )

  return (
    total.bytesReceived > 0 &&
    total.bytesSent > 0 &&
    total.inboundAudioPackets > 0 &&
    total.inboundVideoPackets > 0 &&
    total.outboundAudioPackets > 0 &&
    total.outboundVideoPackets > 0
  )
}

const waitForConnectedMesh = async (sessions: RoomCallE2ESession[]) => {
  await Promise.all(sessions.map(({ page }) => waitForParticipantTiles(page, sessions.length)))

  await Promise.all(
    sessions.map(async ({ page, user }) => {
      await expect
        .poll(async () => hasConnectedPeerConnections(await readRoomCallMediaSnapshot(page), sessions.length - 1), {
          timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS
        })
        .toBe(true)

      await expect
        .poll(async () => hasTwoWayRtp(await readRoomCallMediaSnapshot(page)), {
          message: `${user.nickname} should send and receive audio/video RTP`,
          timeout: ROOM_CALL_E2E_RTP_TIMEOUT_MS
        })
        .toBe(true)
    })
  )
}

const expectSnapshotJsonToContain = async (page: Page, value: string) => {
  await expect
    .poll(async () => JSON.stringify(await readRoomCallMediaSnapshot(page)), { timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })
    .toContain(value)
}

const ensureRoomCallDeviceSettingsOpen = async (page: Page) => {
  const settings = page.locator('.room-call-io-device-settings').first()

  try {
    await expect(settings).toBeVisible({ timeout: 1_000 })
    return
  } catch {
    await clickRoomCallPanelControl(page, ROOM_CALL_E2E_LABELS.callDevices)
  }

  try {
    await expect(settings).toBeVisible({ timeout: 4_000 })
    return
  } catch {
    await clickRoomCallPanelControl(page, ROOM_CALL_E2E_LABELS.callDevices)
  }

  await expect(settings).toBeVisible({ timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })
}

const closeRoomCallDeviceSettings = async (page: Page) => {
  const settings = page.locator('.room-call-io-device-settings').first()

  if (!(await settings.isVisible())) {
    return
  }

  await page.keyboard.press('Escape')
  await expect(settings).toBeHidden({ timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })
}

const selectDeviceOption = async (
  page: Page,
  fieldLabel: string,
  optionLabel: string,
  expectedSnapshotValue: string
) => {
  await ensureRoomCallDeviceSettingsOpen(page)

  const field = page.locator('.room-call-io-device-settings__field').filter({ hasText: fieldLabel })

  await field.locator('.nmorph-select__selected-values-line').click()
  await page.getByRole('option', { name: optionLabel }).click()
  await expectSnapshotJsonToContain(page, expectedSnapshotValue)
}

test.use({
  launchOptions: {
    args: ['--autoplay-policy=no-user-gesture-required']
  }
})

test.describe('group room call e2e', () => {
  test.setTimeout(ROOM_CALL_E2E_TEST_TIMEOUT_MS)
  test('connects three participants with media, screen sharing, commands, devices, leave, rejoin, and disconnect cleanup', async ({
    browser
  }) => {
    const sessions = await Promise.all(ROOM_CALL_E2E_USERS.map((user) => createRoomCallSession(browser, user)))
    const [ethan, olivia, maya] = sessions

    try {
      await Promise.all(sessions.map(({ page }) => openFixtureGroupChat(page)))

      await clickControl(ethan.page, ROOM_CALL_E2E_LABELS.startVideoCall)
      await waitForRoomCallStart(ethan, [olivia, maya])
      await clickControl(olivia.page, ROOM_CALL_E2E_LABELS.joinVideo)
      await clickControl(maya.page, ROOM_CALL_E2E_LABELS.joinVideo)
      await waitForConnectedMesh(sessions)

      await ensureGridView(ethan.page)
      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.quickCommands)
      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.raiseHand)
      await expect(olivia.page.locator('.room-call-tile__quick-command--hand')).toBeVisible()
      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.yes)
      await expect(
        olivia.page.locator('.room-call-tile__quick-command--temporary').filter({ hasText: 'yes' })
      ).toBeVisible()

      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.toggleMicrophone)
      await expect(olivia.page.locator('.room-call-tile').filter({ hasText: ethan.user.nickname })).toBeVisible()
      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.toggleMicrophone)

      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.toggleCamera)
      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.toggleCamera)
      await expectSnapshotJsonToContain(ethan.page, 'video')

      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.toggleScreenSharing)
      await expect
        .poll(async () => (await readRoomCallMediaSnapshot(ethan.page)).displayMediaCalls.length, {
          timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS
        })
        .toBeGreaterThan(0)
      await Promise.all(sessions.map(({ page }) => waitForParticipantTiles(page, 4)))

      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.toggleScreenSharing)
      await Promise.all(sessions.map(({ page }) => waitForParticipantTiles(page, 3)))

      await selectDeviceOption(
        ethan.page,
        ROOM_CALL_E2E_DEVICE_LABELS.audioInput,
        ROOM_CALL_E2E_DEVICE_OPTION_LABELS.audioInput,
        ROOM_CALL_E2E_DEVICE_IDS.audioInput
      )
      await selectDeviceOption(
        ethan.page,
        ROOM_CALL_E2E_DEVICE_LABELS.videoInput,
        ROOM_CALL_E2E_DEVICE_OPTION_LABELS.videoInput,
        ROOM_CALL_E2E_DEVICE_IDS.videoInput
      )
      await selectDeviceOption(
        ethan.page,
        ROOM_CALL_E2E_DEVICE_LABELS.audioOutput,
        ROOM_CALL_E2E_DEVICE_OPTION_LABELS.audioOutput,
        ROOM_CALL_E2E_DEVICE_IDS.audioOutput
      )

      await closeRoomCallDeviceSettings(ethan.page)
      await clickRoomCallPanelControl(ethan.page, ROOM_CALL_E2E_LABELS.switchCamera)
      await expectSnapshotJsonToContain(ethan.page, 'facingMode')
      await waitForConnectedMesh(sessions)

      await clickRoomCallPanelControl(maya.page, ROOM_CALL_E2E_LABELS.leaveCall)
      await Promise.all([waitForParticipantTiles(ethan.page, 2), waitForParticipantTiles(olivia.page, 2)])

      await clickControl(maya.page, ROOM_CALL_E2E_LABELS.joinVideo)
      await waitForConnectedMesh(sessions)

      await maya.context.close()
      await Promise.all([waitForParticipantTiles(ethan.page, 2), waitForParticipantTiles(olivia.page, 2)])

      await clickRoomCallPanelControl(olivia.page, ROOM_CALL_E2E_LABELS.leaveCall)
      await expect(ethan.page.locator('.room-call-panel')).toHaveCount(0, { timeout: ROOM_CALL_E2E_SYNC_TIMEOUT_MS })
      await expect(ethan.page.getByText(/2 participants?/i)).toHaveCount(0)
    } finally {
      await Promise.allSettled(sessions.map(({ context }) => context.close()))
    }
  })
})
