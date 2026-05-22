import type { ConfirmEmailResponse, SendConfirmationLinkResponse } from 'global-shared'

export interface SocketTokenPayload {
  id: string
}

export interface ConfirmEmailResult extends ConfirmEmailResponse {
  alreadyConfirmed: boolean
}

export interface SendConfirmationLinkResult extends SendConfirmationLinkResponse {
  alreadyConfirmed: boolean
  rateLimited: boolean
}
