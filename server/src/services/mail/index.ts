import ENV from '../../ENV'
import nodemailer from 'nodemailer'
import letters, { LettersType } from './letters'
import { UserModel } from '../../models/user.model'
import getTimeNextRequest from '../../utils/getNextTimeRequest'
import { RouteNames } from '../../../../types'

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.MAIL_APP,
    pass: ENV.MAIL_PASS
  }
})

const mailer = async (to: string, letterType: LettersType, payload: any) => {
  return await mailTransport.sendMail({
    from: ENV.MAIL_APP,
    to,
    subject: 'Email confirmation',
    text: 'Email confirm',
    html: letters[letterType](payload)
  })
}

export const sendEmailConfirmationLink = async (email: string) => {
  const user = await UserModel.findOneAndUpdate({ email }, { $inc: { confirmAttempts: -1 } })
  await mailer(email, 'confirmation', {
    appName: ENV.APP_NAME,
    link: `${ENV.HOST}:${ENV.CLIENT_PORT}${RouteNames.EMAIL_CONFIRM}?userId=${user?.id}`
  })
  const hasAttempts = user?.confirmAttempts && user.confirmAttempts >= 0
  if (!hasAttempts) return
  return { email, timeNextRequest: getTimeNextRequest(), attempts: user?.confirmAttempts }
}
