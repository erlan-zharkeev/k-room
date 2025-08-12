import { AppResponseType, IAppRequest } from 'shared-config'

import { updateTokens } from '../~shared'
import { MESSAGE } from './config'

export const updateTokensPair = async (req: IAppRequest, res: AppResponseType<null>) => {
  const userId = req.app.locals.id
  await updateTokens(userId, req, res)
  res.json({ data: null, message: { text: MESSAGE.tokensPairUpdated, silent: true } })
}
