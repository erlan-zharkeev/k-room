import ENV from '../../ENV'
import nodemailer from 'nodemailer'
import letters, { LettersType } from './letters'
import { UserModel } from '../../models/user.model'
import getTimeNextRequest from '../../utils/getNextTimeRequest'
import { CommonEndPoints, RouteNames } from '../../../../types'

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.MAIL_APP,
    pass: ENV.MAIL_PASS
  }
})

const mailer = async (to: string, letterType: LettersType, subject: string, payload: any) => {
  return await mailTransport.sendMail({
    from: ENV.MAIL_APP,
    to,
    subject,
    html: letters[letterType](payload)
  })
}

export const sendEmailConfirmationLink = async (email: string) => {
  const user = await UserModel.findOneAndUpdate({ email }, { $inc: { confirmAttempts: -1 } })
  await mailer(email, 'confirmation', 'Email confirmation', {
    appName: ENV.APP_NAME,
    link: `${ENV.CLIENT_URL}${RouteNames.EMAIL_CONFIRM}?userId=${user?.id}`,
    logoSrc: `${ENV.SERVER_URL}${CommonEndPoints.COMMON_IMAGES}?img=logo(70x70).png`,
    host: `${ENV.CLIENT_URL}/sign-in`
  })
  const hasAttempts = user?.confirmAttempts && user.confirmAttempts >= 0
  return hasAttempts ? { email, timeNextRequest: getTimeNextRequest(), attempts: user?.confirmAttempts } : null
}

export const sendEmailCodePasswordRecovery = async (email: string, code: string | number) => {
  await mailer(email, 'passwordRepairSentCode', 'Password recovery', {
    appName: ENV.APP_NAME,
    logoSrc: `${ENV.SERVER_URL}${CommonEndPoints.COMMON_IMAGES}?img=logo(70x70).png`,
    host: `${ENV.CLIENT_URL}/sign-in`,
    code
  })
  return { message: 'code sended' }
}
