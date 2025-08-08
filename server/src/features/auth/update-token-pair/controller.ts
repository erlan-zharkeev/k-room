import { Response } from 'express'
import { IRequest, ServerNotificationMessage } from 'shared-config'

import { updateTokens } from '../~shared'

export const updateTokensPair = async (req: IRequest, res: Response) => {
  const userId = req.app.locals.id
  await updateTokens(userId, req, res)
  res.json({ message: ServerNotificationMessage.TokensPairUpdated, silent: true })
}
