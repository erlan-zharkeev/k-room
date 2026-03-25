import { updateTokens } from 'features/auth'

import { AppResponseType, IAppRequest } from 'shared-config'
import { getLocalizedText } from 'shared-lib'

import { MESSAGE } from './config'

export const updateTokensPair = async (req: IAppRequest, res: AppResponseType<null>) => {
  const userId = req.app.locals.id
  await updateTokens(userId, req, res)
  res.json({ payload: null, message: { text: getLocalizedText(MESSAGE.tokensPairUpdated, req.language), silent: true } })
}
