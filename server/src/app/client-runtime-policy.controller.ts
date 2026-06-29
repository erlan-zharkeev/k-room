import { Controller, Get, Header, Query } from '@nestjs/common'
import { CLIENT_RUNTIME_ENDPOINTS, isString, type ClientRuntimePolicyResponse } from 'global-shared'

import { SERVER_ENV } from './env'

@Controller()
export class ClientRuntimePolicyController {
  @Get(CLIENT_RUNTIME_ENDPOINTS.getRuntimePolicy)
  @Header('Cache-Control', 'no-store')
  getClientRuntimePolicy(@Query('version') version?: unknown): ClientRuntimePolicyResponse {
    const currentVersion = isString(version) ? version : ''
    const isBlocked = SERVER_ENV.client.blockedAppVersions.includes(currentVersion)

    return {
      currentVersion,
      latestVersion: SERVER_ENV.info.clientAppVersion,
      isBlocked,
      action: isBlocked ? 'hard-update' : 'none'
    }
  }
}
