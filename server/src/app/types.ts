import type { Server as HttpServer } from 'http'
import type { Server as HttpsServer } from 'https'

export type SocketServerType = HttpServer | HttpsServer

export interface IHealthResponse {
  ok: true
}
