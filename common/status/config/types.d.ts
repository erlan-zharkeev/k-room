import { REQ_STATUS } from './constants';
export type ReqStatusType = (typeof REQ_STATUS)[keyof typeof REQ_STATUS];
