import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import { sendEmailConfirmationLink } from '../services/mail'
import { updateTokens } from '../services/jwt'
import authValidator from '../middlewares/authValidator'
import { NotificationMessage, Status, UserCredential } from '../../../types'
import { v4 as uuidv4 } from 'uuid'
import { initUserCodes } from '../fixtures/helpers/initUserCodes'
import { getInfo } from '../services/info/getInfo'
import initUserSettings from '../fixtures/helpers/initUserSettings'

const bcrypt = require('bcryptjs')

class AuthController {
  async updateTokensPair(req: Request, res: Response) {
    const { id } = req.body.decoded
    await updateTokens(id, res)
    res.json({ message: NotificationMessage.tokensPairUpdated, silent: true })
  }

  async registration(req: Request, res: Response) {
    try {
      authValidator(req, res)
      let { username, email, password } = req.body

      const userNameCandidate = await UserModel.findOne({ username })

      if (userNameCandidate)
        return throwError(Status.badRequest, res, NotificationMessage.userWithCurrentNameAlreadyExist)

      const emailCandidate = await UserModel.findOne({ email })

      if (emailCandidate)
        return throwError(Status.badRequest, res, NotificationMessage.userWithCurrentEmailAlreadyExist)

      const hashedPassword = await bcrypt.hash(password, 6)

      if (!hashedPassword) return throwError(Status.badRequest, res, NotificationMessage.failedPassHash)
      const welcomeInfoItem = getInfo('1')
      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        socketId: '',
        settings: initUserSettings,
        codes: initUserCodes,
        infoItems: [welcomeInfoItem]
      })

      await user.save()

      const confirmEmailData = await sendEmailConfirmationLink(req.body.email)
      if (!confirmEmailData)
        return throwError(Status['unreachable'], res, NotificationMessage.failedSendConfirmationLink)

      return res.json(confirmEmailData)
    } catch (e: any) {
      throwError(Status.badRequest, res, NotificationMessage.failedRegistration)
    }
  }

  async sendConfirmationLink(req: Request, res: Response) {
    const { email } = req.body
    try {
      const confirmEmailData = await sendEmailConfirmationLink(email)
      return res.json(confirmEmailData)
    } catch {
      throwError(Status['unreachable'], res, NotificationMessage.failedSendConfirmEmail)
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      const userId = req.body.userId
      const user = await UserModel.findOneAndUpdate({ _id: userId }, { confirmed: true }, { new: true })
      if (!user) return
      return res.json({
        userData: { username: user.username, email: user.email, id: user._id, avatar: user.avatarPath },
        message: NotificationMessage.emailConfirmed
      })
    } catch {
      throwError(Status.badRequest, res, NotificationMessage.failedEmailConfirm)
    }
  }

  async login(req: Request, res: Response) {
    try {
      let { email, password } = req.body
      const user = await UserModel.findOne({ email })
      if (!user) return throwError(Status.badRequest, res, NotificationMessage.userNotFound)
      if (!user.confirmed) return throwError(Status.badRequest, res, NotificationMessage.emailNotConfirm)

      const validPassword = bcrypt.compareSync(password, user.password)

      if (!validPassword) return throwError(Status.badRequest, res, NotificationMessage.wrongPass)

      await updateTokens(user._id, res)
      return res.json({
        userData: {
          username: user.username,
          email,
          id: user._id,
          avatarPath: user.avatarPath,
          infoItems: user.infoItems
        },
        settings: user.settings,
        message: NotificationMessage.loginSuccess
      })
    } catch (e: any) {
      console.log(e, '!!!!!!!!!!!')
      throwError(Status.badRequest, res, NotificationMessage.failedLogin)
    }
  }

  async signInWithProvider(req: Request, res: Response) {
    try {
      const { username, email, avatarPath, providerName }: UserCredential = req.body
      let user = await UserModel.findOne({ email })
      if (!user) {
        const hashedPassword = await bcrypt.hash(uuidv4(), 6)
        user = new UserModel({
          username,
          email,
          avatarPath,
          providerName,
          password: hashedPassword,
          socketId: '',
          confirmed: true,
          settings: initUserSettings,
          codes: initUserCodes
        })
        await user.save()
      }

      await updateTokens(user._id, res)

      return res.json({
        userData: {
          username: user.username ?? username,
          email,
          id: user?._id,
          avatarPath: user.avatarPath ?? avatarPath
        },
        settings: user.settings,
        message: NotificationMessage.loginAndRegister
      })
    } catch {
      throwError(Status.badRequest, res, NotificationMessage.failedLogin)
    }
  }
}

export default new AuthController()
