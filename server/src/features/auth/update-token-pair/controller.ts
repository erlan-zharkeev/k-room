import { updateTokens } from 'src/features/auth'
import { MESSAGE } from 'src/features/auth/update-token-pair'

import { AppResponseType, IAppRequest } from 'src/shared/config'
import { getLocalizedText } from 'src/shared/lib'

export const updateTokensPair = async (req: IAppRequest, res: AppResponseType<null>) => {
  const userId = req.app.locals.id
  await updateTokens(userId, req, res)
  res.json({
    payload: null,
    message: { text: getLocalizedText(MESSAGE.tokensPairUpdated, req.language), silent: true }
  })
}
