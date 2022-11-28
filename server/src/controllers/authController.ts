import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import { sendEmailConfirmationLink } from './../services/mail'
import setAccessToken from '../services/jwt'
import authValidator from '../middlewares/authValidator'
import { Messages } from '../types/Messages'
const bcrypt = require('bcryptjs')
const Grid = require('gridfs-stream')

import db from './../database'
import mongoose from 'mongoose'

const connection = db.connection

let gfs = null as any
let gridfsBucket = null as any

connection.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads'
  })

  gfs = Grid(connection.db, mongoose.mongo)
  gfs.collection('uploads')
})
class AuthController {
  async registration(req: Request, res: Response) {
    try {
      authValidator(req, res)

      const { username, email, password } = req.body
      const candidate = await UserModel.findOne({ email })

      if (candidate) return throwError(400, res, Messages.userExist)

      const hashedPassword = await bcrypt.hash(password, 6)

      if (!hashedPassword) return throwError(400, res, Messages.passHashFailed)

      const user = new UserModel({ username, email, password: hashedPassword, socketId: '' })
      await user.save()

      const confirmEmailData = await sendEmailConfirmationLink(req.body.email)
      return res.json(confirmEmailData)
    } catch (e) {
      throwError(400, res, Messages.registrationCommonError)
    }
  }

  async sendConfirmationLink(req: Request, res: Response) {
    const { email } = req.body
    try {
      const confirmEmailData = await sendEmailConfirmationLink(email)
      return res.json(confirmEmailData)
    } catch {
      throwError(503, res, Messages.sendConfirmEmailFailed)
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
      throwError(400, res, Messages.emailConfirmFailed)
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const user = await UserModel.findOne({ email })
      if (!user) return throwError(400, res, Messages.userNotFound)
      if (!user.confirmed) return throwError(400, res, Messages.emailNotConfirm)

      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) return throwError(400, res, Messages.wrongPass)

      setAccessToken(user._id, res)

      return res.json({
        userData: { username: user.username, email, id: user._id, avatar: user.avatar },
        message: Messages.loginSuccess
      })
    } catch (e: any) {
      throwError(400, res, Messages.loginCommonError)
    }
  }

  async updateUserData(req: any, res: Response) {
    try {
      const filename = req.file.filename
      const { userId, username } = req.body
      const updateUserDataResponse = await UserModel.findOneAndUpdate(
        { _id: userId },
        { username, avatar: `api/image/${filename}` },
        { new: true }
      )
      if (!updateUserDataResponse) return throwError(400, res, Messages.usersFindFailed)
      return res.json({
        userData: {
          username: updateUserDataResponse.username,
          avatar: updateUserDataResponse.avatar
        },
        message: Messages.userDataSuccess
      })
    } catch (e: any) {
      throwError(400, res, Messages.userDataUpdateFailedCommonError)
    }
  }

  async showFiles(req: Request, res: Response) {
    gfs.files.findOne({ filename: req.params.filename }, (_: any, file: any) => {
      if (!file || file.length === 0) return throwError(404, res, Messages.noFilesExist)
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        const readstream = gridfsBucket.openDownloadStream(file._id)
        readstream.pipe(res)
      } else throwError(404, res, Messages.notImage)
    })
  }
}

export default new AuthController()
