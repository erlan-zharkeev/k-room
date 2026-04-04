import { AppResponseType, IAppRequest } from 'src/shared/config'
import { localizedText } from 'src/shared/lib'

import { updateTokens } from './../shared'
import { UPDATE_TOKEN_PAIR_I18N } from './config'

export const updateTokensPairController = async (req: IAppRequest, res: AppResponseType<null>) => {
  const userId = req.app.locals.id
  await updateTokens(userId, req, res)
  res.json({
    payload: null,
    message: { text: localizedText(UPDATE_TOKEN_PAIR_I18N.tokensPairUpdated, req.language), silent: true }
  })
}
