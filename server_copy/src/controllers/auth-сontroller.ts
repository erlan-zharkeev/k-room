import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { initUserCodes } from '../fixtures'
import { authValidator } from '../middlewares'
import { updateTokens, getPreviewInfoNotification, sendEmailConfirmationLink } from '../services'
import type { AuthLoginPayloadType, AuthRegistrationPayloadType, UserCredentialType } from 'common-types'
import { ServerNotificationMessage } from 'shared/types'
import { StatusEnum } from 'common-types'

import { throwError } from '../utils'
import { UserModel } from 'entities/user'

const bcrypt = require('bcryptjs')

class AuthController {
  async updateTokensPair(req: Request, res: Response) {
    const userId = req.app.locals.id
    await updateTokens(userId, res)
    res.json({ message: ServerNotificationMessage.TokensPairUpdated, silent: true })
  }

  async registration(req: Request, res: Response) {
    try {
      authValidator(req, res)
      const { username, email, password } = req.body as AuthRegistrationPayloadType
      const userNameCandidate = await UserModel.findOne({ username })

      if (userNameCandidate) {
        return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.UserWithCurrentNameAlreadyExist)
      }

      const emailCandidate = await UserModel.findOne({ email })

      if (emailCandidate) {
        return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.UserWithCurrentEmailAlreadyExist)
      }

      const hashedPassword = await bcrypt.hash(password, 6)

      if (!hashedPassword) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedPassHash)
      const welcomeInfoNotification = getPreviewInfoNotification('1')
      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        socketId: '',
        avatarPath: '',
        codes: initUserCodes,
        infoNotifications: [welcomeInfoNotification],
        role: 'user'
      })

      await user.save()

      const confirmEmailData = await sendEmailConfirmationLink(req.body.email)
      if (!confirmEmailData) {
        return throwError(StatusEnum.Unreachable, res, ServerNotificationMessage.FailedSendConfirmationLink)
      }

      return res.json({ confirmEmailData, message: ServerNotificationMessage.RegistrationSuccess })
    } catch {
      throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedRegistration)
    }
  }

  async sendConfirmationLink(req: Request, res: Response) {
    const { email } = req.body
    try {
      const confirmEmailData = await sendEmailConfirmationLink(email)
      return res.json(confirmEmailData)
    } catch {
      throwError(StatusEnum.Unreachable, res, ServerNotificationMessage.FailedSendConfirmEmail)
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      const userId = req.body.userId
      const user = await UserModel.findOneAndUpdate({ _id: userId }, { confirmed: true }, { new: true })
      if (!user) return
      return res.json({
        userData: { username: user.username, email: user.email, id: user._id, avatar: user.avatarPath },
        message: ServerNotificationMessage.EmailConfirmed
      })
    } catch {
      throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedEmailConfirm)
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as AuthLoginPayloadType
      const user = await UserModel.findOne({ email })
      if (!user) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.UserNotFound)
      if (!user.confirmed) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.EmailNotConfirm)

      const validPassword = bcrypt.compareSync(password, user.password)

      if (!validPassword) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.WrongPass)
      await updateTokens(user._id.toString(), res)
      return res.json({
        userData: {
          role: user.role,
          username: user.username,
          email,
          id: user._id,
          avatarPath: user.avatarPath,
          infoNotifications: user.infoNotifications
        },
        message: ServerNotificationMessage.LoginSuccess,
        silent: true
      })
    } catch {
      throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedLogin)
    }
  }

  async signInWithProvider(req: Request, res: Response) {
    try {
      const { username, email, avatarPath, providerName }: UserCredentialType = req.body
      let user = await UserModel.findOne({ email })
      if (!user) {
        const hashedPassword = await bcrypt.hash(uuidv4(), 6)
        const welcomeInfoNotification = getPreviewInfoNotification('1')
        user = new UserModel({
          username,
          role: 'user',
          email,
          avatarPath,
          providerName,
          password: hashedPassword,
          socketId: '',
          confirmed: true,
          codes: initUserCodes,
          infoNotifications: [welcomeInfoNotification]
        })
        await user.save()
      }

      await updateTokens(user._id.toString(), res)

      return res.json({
        userData: {
          username: user.username ?? username,
          email,
          id: user?._id,
          avatarPath: user.avatarPath ?? avatarPath,
          role: user.role,
          infoNotifications: user.infoNotifications
        },
        message: ServerNotificationMessage.LoginWithProvider,
        silent: true
      })
    } catch {
      throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedLogin)
    }
  }
}

export const controller = new AuthController()
