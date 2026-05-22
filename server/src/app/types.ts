import type { Server as HttpServer } from 'http'
import type { Server as HttpsServer } from 'https'

export type SocketServer = HttpServer | HttpsServer

export interface HealthResponse {
  ok: true
}
