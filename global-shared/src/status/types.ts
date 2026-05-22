import { REQ_STATUS } from './constants'

export type ReqStatus = (typeof REQ_STATUS)[keyof typeof REQ_STATUS]
