import { WELCOME_INFO_NOTIFICATION_ID } from 'global-shared'
import { Types } from 'mongoose'

export const INFO_NOTIFICATION_FIXTURES = [
  {
    _id: new Types.ObjectId(WELCOME_INFO_NOTIFICATION_ID),
    title: {
      en: 'Welcome to K-Room',
      ru: 'Добро пожаловать в K-Room',
      zh: '欢迎使用 K-Room'
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
      ],
      zh: [
        '我们很高兴向你介绍网页版应用的 beta 版本。在这里，你可以与朋友和亲人顺畅交流：使用私聊、发送文字消息、分享照片，并进行普通通话和视频通话。',
        '创建自己的群聊，将朋友、同事或家人聚在一起，方便群组内沟通和信息交流。',
        '无论亲友身在何处，都可以享受高质量视频通话。也可以直接在聊天中发送和接收照片，与朋友分享生活中的精彩瞬间。',
        '随着网站持续开发，我们会带来更多功能和改进，让你的体验更加出色。'
      ]
    },
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
]
