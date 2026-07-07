import { AUTH_FIXTURE_PASSWORD } from 'e2e/auth/constants'

export const ROOM_CALL_E2E_TEST_TIMEOUT_MS = 300_000
export const ROOM_CALL_E2E_SYNC_TIMEOUT_MS = 25_000
export const ROOM_CALL_E2E_RTP_TIMEOUT_MS = 45_000
export const ROOM_CALL_E2E_STORED_CALL_DIAGNOSTIC_LIMIT = 5
export const ROOM_CALL_E2E_STORED_CALL_DIAGNOSTIC_WINDOW_MS = 60_000
export const ROOM_CALL_E2E_GROUP_CHAT_NAME = 'Product Studio'
export const ROOM_CALL_E2E_DEVICE_LABELS = {
  audioInput: 'Audio input device',
  audioOutput: 'Audio output device',
  videoInput: 'Video input device'
} as const
export const ROOM_CALL_E2E_DEVICE_IDS = {
  audioInput: 'e2e-audio-input-2',
  audioOutput: 'e2e-audio-output-2',
  videoInput: 'e2e-video-input-2'
} as const
export const ROOM_CALL_E2E_DEVICE_OPTION_LABELS = {
  audioInput: 'External microphone',
  audioOutput: 'External speaker',
  videoInput: 'Rear camera'
} as const
export const ROOM_CALL_E2E_LABELS = {
  callDevices: 'Call devices',
  focusView: 'Focus view',
  gridView: 'Grid view',
  joinVideo: 'Join with video',
  leaveCall: 'Leave call',
  quickCommands: 'Quick commands',
  raiseHand: 'raise hand',
  startVideoCall: 'Start video call',
  switchCamera: 'Switch camera',
  toggleCamera: 'Toggle camera',
  toggleMicrophone: 'Toggle microphone',
  toggleScreenSharing: 'Toggle screen sharing',
  yes: 'yes'
} as const
export const ROOM_CALL_E2E_USERS = [
  {
    nickname: 'ethan',
    email: 'ethan@gmail.com',
    password: AUTH_FIXTURE_PASSWORD
  },
  {
    nickname: 'olivia',
    email: 'olivia@gmail.com',
    password: AUTH_FIXTURE_PASSWORD
  },
  {
    nickname: 'maya',
    email: 'maya@gmail.com',
    password: AUTH_FIXTURE_PASSWORD
  }
] as const
