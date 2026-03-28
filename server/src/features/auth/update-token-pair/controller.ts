import { AppResponseType, IAppRequest } from 'src/shared/config'
import { getLocalizedText } from 'src/shared/lib'

import { updateTokens } from '../shared/lib/update-token'

import { I18N_UPDATE_TOKEN_PAIR_MESSAGE } from './config'

export const updateTokensPair = async (req: IAppRequest, res: AppResponseType<null>) => {
  const userId = req.app.locals.id
  await updateTokens(userId, req, res)
  res.json({
    payload: null,
    message: { text: getLocalizedText(I18N_UPDATE_TOKEN_PAIR_MESSAGE.tokensPairUpdated, req.language), silent: true }
  })
}
