import type { CLIENT_RUNTIME_POLICY_ACTIONS } from './constants'

export type ClientRuntimePolicyAction = (typeof CLIENT_RUNTIME_POLICY_ACTIONS)[number]

export interface ClientRuntimePolicyResponse {
  currentVersion: string
  latestVersion: string
  isBlocked: boolean
  action: ClientRuntimePolicyAction
}
