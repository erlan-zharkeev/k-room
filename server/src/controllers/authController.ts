import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import { sendEmailConfirmationLink } from '../services/mail'
import { updateTokens } from '../services/jwt'
import authValidator from '../middlewares/authValidator'
import { Messages } from '../types/Messages'
import { Status, UserCredential } from '../../../types'
import { uniqueId } from 'lodash'
import initUserSettings from '../fixtures/initUserSettings'
const bcrypt = require('bcryptjs')

class AuthController {
  async updateTokensPair(req: Request, res: Response) {
    const { id } = req.body.decoded
    await updateTokens(id, res)
    res.json({ message: Messages.tokensPairUpdated, silent: true })
  }

  async registration(req: Request, res: Response) {
    try {
      authValidator(req, res)
      let { username, email, password } = req.body

      const candidate = await UserModel.findOne({ email })
      if (candidate) return throwError(Status.BAD_REQUEST, res, Messages.userExist)

      const hashedPassword = await bcrypt.hash(password, 6)

      if (!hashedPassword) return throwError(Status.BAD_REQUEST, res, Messages.passHashFailed)

      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        socketId: '',
        settings: initUserSettings
      })

      await user.save()

      const confirmEmailData = await sendEmailConfirmationLink(req.body.email)
      if (!confirmEmailData) return throwError(Status.UNREACHABLE, res, Messages.failedToSendConfirmationLink)

      return res.json(confirmEmailData)
    } catch (e) {
      console.log(e)
      throwError(Status.BAD_REQUEST, res, Messages.registrationCommonError)
    }
  }

  async sendConfirmationLink(req: Request, res: Response) {
    const { email } = req.body
    try {
      const confirmEmailData = await sendEmailConfirmationLink(email)
      return res.json(confirmEmailData)
    } catch {
      throwError(Status.UNREACHABLE, res, Messages.sendConfirmEmailFailed)
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      const userId = req.body.userId
      const user = await UserModel.findOneAndUpdate({ _id: userId }, { confirmed: true }, { new: true })
      if (!user) return
      return res.json({
        userData: { username: user.username, email: user.email, id: user._id, avatar: user.avatar },
        message: Messages.emailConfirmed
      })
    } catch {
      throwError(Status.BAD_REQUEST, res, Messages.emailConfirmFailed)
    }
  }

  async login(req: Request, res: Response) {
    try {
      let { email, password } = req.body

      const user = await UserModel.findOne({ email })
      if (!user) return throwError(Status.BAD_REQUEST, res, Messages.userNotFound)
      if (!user.confirmed) return throwError(Status.BAD_REQUEST, res, Messages.emailNotConfirm)

      const validPassword = bcrypt.compareSync(password, user.password)

      if (!validPassword) return throwError(Status.BAD_REQUEST, res, Messages.wrongPass)

      await updateTokens(user._id, res)
      return res.json({
        userData: { username: user.username, email, id: user._id, avatar: user.avatar },
        settings: user.settings,
        message: Messages.loginSuccess
      })
    } catch (e: any) {
      console.log(e)
      throwError(Status.BAD_REQUEST, res, Messages.loginCommonError)
    }
  }
  async signInWithProvider(req: Request, res: Response) {
    try {
      const { id, username, email, avatar, providerId }: UserCredential = req.body
      const providerCandidate = await UserModel.findOne({ providerId: id })

      if (providerCandidate) {
        await updateTokens(providerCandidate._id, res)
        return res.json({
          userData: {
            username: providerCandidate.username,
            email,
            id: providerCandidate._id,
            avatar: providerCandidate.avatar
          },
          settings: providerCandidate.settings,
          message: Messages.loginSuccess
        })
      }

      const emailAlreadyInUse = await UserModel.findOne({ email })

      if (!providerCandidate && emailAlreadyInUse) {
        return throwError(Status.BAD_REQUEST, res, Messages.emailLinkedToAnotherMethod)
      }

      const user = new UserModel({
        providerUserId: id,
        username,
        email,
        avatar,
        providerId,
        password: uniqueId(),
        socketId: '',
        settings: initUserSettings
      })

      const newUser = await user.save()

      await updateTokens(newUser._id, res)
      return res.json({
        userData: {
          username: newUser.username,
          email,
          id: newUser._id,
          avatar: newUser.avatar
        },
        settings: newUser.settings,
        message: Messages.loginAndRegisterSuccess
      })
    } catch (e: any) {
      throwError(Status.BAD_REQUEST, res, Messages.loginCommonError)
    }
  }
}

export default new AuthController()
