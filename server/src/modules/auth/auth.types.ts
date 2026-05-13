import type { IConfirmEmailResponse, ISendConfirmationLinkResponse } from 'global-shared'

export interface ISocketTokenPayload {
  id: string
}

export interface IConfirmEmailResult extends IConfirmEmailResponse {
  alreadyConfirmed: boolean
}

export interface ISendConfirmationLinkResult extends ISendConfirmationLinkResponse {
  alreadyConfirmed: boolean
  rateLimited: boolean
}
