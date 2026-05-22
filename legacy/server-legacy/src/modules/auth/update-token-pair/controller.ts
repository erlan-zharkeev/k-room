import { AppResponse, AppRequest } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'

import { updateTokens } from '../shared/lib/update-token'

import { UPDATE_TOKEN_PAIR_I18N } from './i18n'

export const updateTokensPairController = async (req: AppRequest, res: AppResponse<null>) => {
  const userId = req.app.locals.id
  await updateTokens(userId, req, res)
  res.json({
    payload: null,
    message: { text: localizedText(UPDATE_TOKEN_PAIR_I18N.tokensPairUpdated, req.language), silent: true }
  })
}
