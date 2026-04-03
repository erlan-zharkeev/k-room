import { Types } from 'mongoose'

import { WELCOME_INFO_NOTIFICATION_ID } from 'common'

import { log } from 'src/shared/lib'

import { InfoNotificationModel } from '../model'
import { UserModel } from '../../user'

type InfoNotificationFixtureType = {
  _id: Types.ObjectId
  title: {
    en: string
    ru: string
  }
  content: {
    en: string[]
    ru: string[]
  }
  isActive: boolean
  createdAt: number
  updatedAt: number
}

const now = Date.now()

const LEGACY_WELCOME_INFO_NOTIFICATION_ID = 1

export const INFO_NOTIFICATION_FIXTURES: InfoNotificationFixtureType[] = [
  {
    _id: new Types.ObjectId(WELCOME_INFO_NOTIFICATION_ID),
    title: {
      en: 'Welcome to K-Room',
      ru: 'Добро пожаловать в K-Room'
    },
    content: {
      en: [
        'We are excited to introduce you to the beta version of our web app, where you can seamlessly communicate with your friends and loved ones. Connect through private chats, exchange text messages, share photos, and engage in both regular and video calls.',
        'Create your own group chats to bring together friends, colleagues, or family members, allowing for seamless communication and information exchange within the group.',
        "Enjoy the ability to make high-quality video calls with your loved ones, no matter where they are located. Share life's brightest moments with friends by sending and receiving photos right within the chat.",
        'As we continue to develop the website, expect even more features and improvements to enhance your experience.'
      ],
      ru: [
        'Мы рады представить вам бета-версию нашего веб-приложения, где вы можете удобно общаться с друзьями и близкими. Общайтесь в личных чатах, обменивайтесь сообщениями, делитесь фотографиями и используйте как обычные, так и видеозвонки.',
        'Создавайте собственные групповые чаты, чтобы объединять друзей, коллег или членов семьи и удобно общаться внутри группы.',
        'Пользуйтесь качественными видеозвонками с близкими вне зависимости от их местоположения. Делитесь яркими моментами жизни с друзьями, отправляя и получая фотографии прямо в чате.',
        'По мере развития сервиса вас будут ждать новые функции и улучшения, которые сделают использование приложения ещё удобнее.'
      ]
    },
    isActive: true,
    createdAt: now,
    updatedAt: now
  }
]

export const loadInfoNotificationFixtures = async () => {
  const results = await Promise.all(
    INFO_NOTIFICATION_FIXTURES.map(async (fixture) => {
      const existingNotification = await InfoNotificationModel.findById(fixture._id, { _id: 1 }).lean()

      if (existingNotification) {
        await InfoNotificationModel.updateOne({ _id: fixture._id }, { $unset: { id: '' } })
        return 'skipped'
      }

      const legacyNotification = await InfoNotificationModel.findOne(
        { id: LEGACY_WELCOME_INFO_NOTIFICATION_ID },
        { _id: 1 }
      ).lean()

      if (legacyNotification) {
        await UserModel.updateMany(
          { 'personal.infoNotifications.1': { $exists: true } },
          {
            $rename: {
              'personal.infoNotifications.1': `personal.infoNotifications.${WELCOME_INFO_NOTIFICATION_ID}`
            }
          }
        )
        await InfoNotificationModel.deleteOne({ _id: legacyNotification._id })
      }

      await InfoNotificationModel.create(fixture)
      return 'created'
    })
  )

  const created = results.filter((result) => result === 'created').length
  const skipped = results.filter((result) => result === 'skipped').length

  log.info(`-Info notification fixtures processed: created=${created}, skipped=${skipped}, failed=0`)
}
