import nodemailer from 'nodemailer'
import { RouteNamesEnum } from '../../@types'
import { ENV } from '../../ENV'
import { UserModel } from '../../models'
import { getTimeNextRequest } from '../../utils'
import { getAdditionalMailData } from './letters'

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.MAIL_APP,
    pass: ENV.K_ROOM_MAIL_PASS
  }
})

export interface MailerPayload {
  to: string
  subject: string
  html: string
}

const mailer = async (payload: MailerPayload) => {
  const { to, subject, html } = payload
  return await mailTransport.sendMail({
    from: ENV.MAIL_APP,
    to,
    subject,
    html
  })
}

export const sendEmailConfirmationLink = async (email: string) => {
  const user = await UserModel.findOneAndUpdate({ email }, { $inc: { confirmAttempts: -1 } })
  const payload = {
    appName: ENV.APP_NAME,
    link: `${ENV.CLIENT_URL}${RouteNamesEnum.EmailConfirmation}?userId=${user?.id}`,
    host: `${ENV.CLIENT_URL}/sign-in`
  }
  const mailData = getAdditionalMailData('confirmation', payload)
  await mailer({ to: email, ...mailData })
  const hasAttempts = user?.confirmAttempts && user.confirmAttempts >= 0
  return hasAttempts ? { email, timeNextRequest: getTimeNextRequest(), attempts: user?.confirmAttempts } : null
}

export const sendEmailCodePasswordRecovery = async (email: string, code: string | number) => {
  const payload = { code }
  const mailData = getAdditionalMailData('password-repair-sent-code', payload)
  await mailer({ to: email, ...mailData })
  return { message: 'code sended' }
}
