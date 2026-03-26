import { updateTokens } from 'features/auth'
import { MESSAGE } from 'features/auth/update-token-pair/config'

import { AppResponseType, IAppRequest } from 'shared-config'
import { getLocalizedText } from 'shared-lib'

export const updateTokensPair = async (req: IAppRequest, res: AppResponseType<null>) => {
  const userId = req.app.locals.id
  await updateTokens(userId, req, res)
  res.json({ payload: null, message: { text: getLocalizedText(MESSAGE.tokensPairUpdated, req.language), silent: true } })
}
