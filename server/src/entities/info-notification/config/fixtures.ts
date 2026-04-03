import { type IInfoNotification } from 'common'

const now = Date.now()

export const INFO_NOTIFICATION_FIXTURES: IInfoNotification[] = [
  {
    id: 1,
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
