import { MESSAGE_STATUS_VALUE } from '../constants'
import type { MessageStatus } from '../types'

export const isMessageSendingStatus = (status?: MessageStatus) => status === MESSAGE_STATUS_VALUE.SENDING

export const isMessageStatusDelivered = (status?: MessageStatus) => status === MESSAGE_STATUS_VALUE.DELIVERED

export const isMessageReadStatus = (status?: MessageStatus) => status === MESSAGE_STATUS_VALUE.READ
