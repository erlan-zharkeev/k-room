import { StreamSettings } from ".";

export type CallStatus = "calling" | "in-progress" | "finished";
export type CallType = "incoming" | "outgoing" | "missed" | "not-answered";

export interface Call {
  id: string;
  calledAt?: number;
  authorId: string;
  authorName: string;
  startedAt: number;
  finishedAt?: number;
  length?: number;
  interlocutorId: string;
  interlocutorName: string;
  interlocutorAvatarPath?: string;
  status?: CallStatus;
  type: CallType;
  video: boolean;
  interlocutorSettings?: StreamSettings;
  setId?: boolean;
}

export interface DBCall {
  _id: string;
  calledAt: number;
  startedAt: number;
  finishedAt: number;
  authorId: string;
  interlocutors: Array<string>;
  answered: boolean;
  video: boolean;
}

export interface IDBCallSchema extends DBCall {}
