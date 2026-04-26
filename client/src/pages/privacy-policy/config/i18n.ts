import { defineI18n } from 'global-shared'

export const LEGAL_INFO_PAGE_I18N = defineI18n({
  title: {
    en: (appName: string) => `Legal Information for ${appName}`,
    ru: (appName: string) => `Правовая информация ${appName}`,
    zh: (appName: string) => `${appName} 法律信息`
  },
  lastUpdatedLabel: {
    en: 'Last updated:',
    ru: 'Последнее обновление:',
    zh: '最后更新：'
  },
  intro: {
    en: (appName: string) =>
      `This Privacy Policy explains what information may be collected when you use ${appName}, how that information may be used, and the limits of our responsibility.`,
    ru: (appName: string) =>
      `Эта политика конфиденциальности объясняет, какие данные могут собираться при использовании ${appName}, как они могут использоваться и где проходят пределы нашей ответственности.`,
    zh: (appName: string) =>
      `本隐私政策说明你使用 ${appName} 时可能收集哪些信息、这些信息可能如何使用，以及我们的责任范围。`
  },
  warning: {
    en: 'Important warning:',
    ru: 'Важное предупреждение:',
    zh: '重要提示：'
  },
  warningText: {
    en: (appName: string) =>
      `${appName} is a general-purpose chat and calling service. It is not designed for storing, transmitting, or protecting highly sensitive, confidential, regulated, financial, medical, government-issued, or otherwise mission-critical information. Do not use ${appName} as a secure vault, legal archive, or protected communications channel.`,
    ru: (appName: string) =>
      `${appName} — это общий сервис для чатов и звонков. Он не предназначен для хранения, передачи или защиты особо чувствительной, конфиденциальной, регулируемой, финансовой, медицинской, государственной или иной критически важной информации. Не используйте ${appName} как защищённое хранилище, юридический архив или безопасный канал связи.`,
    zh: (appName: string) =>
      `${appName} 是通用聊天和通话服务。它并非用于存储、传输或保护高度敏感、机密、受监管、金融、医疗、政府签发或其他关键任务信息。不要将 ${appName} 用作安全保险库、法律档案或受保护的通信渠道。`
  },
  storageRisk: {
    en: 'Messages, files, account data, and technical data may be processed and stored on systems controlled by us or by our service providers. Although we may use reasonable operational measures, we do not promise or guarantee absolute security, confidentiality, availability, or loss prevention. Any use of the service is at your own risk.',
    ru: 'Сообщения, файлы, данные аккаунта и технические данные могут обрабатываться и храниться на системах, которые контролируем мы или наши подрядчики. Даже если мы используем разумные организационные меры, мы не обещаем и не гарантируем абсолютную безопасность, конфиденциальность, доступность или защиту от потери данных. Вы используете сервис на свой риск.',
    zh: '消息、文件、账户数据和技术数据可能会在我们或服务提供商控制的系统中处理和存储。即使我们可能采取合理的运营措施，也不承诺或保证绝对安全、保密、可用或防止数据丢失。你使用本服务需自行承担风险。'
  },
  section1Title: {
    en: '1. Information We Collect',
    ru: '1. Какие данные мы собираем',
    zh: '1. 我们收集的信息'
  },
  section1Intro: {
    en: 'Depending on how you use the service, we may collect or receive the following categories of information:',
    ru: 'В зависимости от того, как вы используете сервис, мы можем собирать или получать следующие категории данных:',
    zh: '根据你使用服务的方式，我们可能收集或接收以下类别的信息：'
  },
  accountData: {
    en: 'Account data such as username, email address, password hash, authentication provider, and confirmation status.',
    ru: 'Данные аккаунта: имя пользователя, email, хэш пароля, провайдер аутентификации и статус подтверждения.',
    zh: '账户数据，例如用户名、email 地址、密码哈希、认证提供商和确认状态。'
  },
  profileData: {
    en: 'Profile and social data such as avatar, contact relationships, chat-room membership, and basic status data such as online/last seen.',
    ru: 'Профильные и социальные данные: аватар, контакты, участие в чатах и базовые статусы вроде online/last seen.',
    zh: '个人资料和社交数据，例如头像、联系人关系、聊天室成员身份，以及在线/最后在线等基础状态数据。'
  },
  communicationData: {
    en: 'Communication data such as message content, message timestamps, reactions, replies, attachments, and related metadata.',
    ru: 'Коммуникационные данные: содержимое сообщений, время отправки, реакции, ответы, вложения и связанная метаинформация.',
    zh: '通信数据，例如消息内容、消息时间戳、回应、回复、附件和相关元数据。'
  },
  technicalData: {
    en: 'Technical/session data such as cookies, refresh tokens, device identifiers, socket identifiers, browser/device details, timestamps, and similar operational logs.',
    ru: 'Технические и сессионные данные: cookies, refresh tokens, идентификаторы устройств и сессии сокета, сведения о браузере/устройстве, временные метки и похожие технические логи.',
    zh: '技术/会话数据，例如 cookies、刷新令牌、设备标识符、socket 标识符、浏览器/设备信息、时间戳和类似运营日志。'
  },
  diagnosticsData: {
    en: 'Support, diagnostic, and security data such as crash/error events and troubleshooting information.',
    ru: 'Данные поддержки, диагностики и безопасности: события ошибок, крашей и информация для разбирательства с проблемами.',
    zh: '支持、诊断和安全数据，例如崩溃/错误事件和故障排查信息。'
  },
  thirdPartyData: {
    en: 'Third-party sign-in data if you use social login providers.',
    ru: 'Данные стороннего входа, если вы используете социальные провайдеры авторизации.',
    zh: '如果你使用社交登录提供商，则包括第三方登录数据。'
  },
  mediaPermissionData: {
    en: 'Device permission and media-related data when you use call features, such as audio/video device availability, permissions, and media streams needed to establish calls.',
    ru: 'Данные о разрешениях и мультимедиа при использовании звонков: доступность аудио/видео-устройств, разрешения и медиапотоки, нужные для установления вызова.',
    zh: '使用通话功能时的设备权限和媒体相关数据，例如音频/视频设备可用性、权限以及建立通话所需的媒体流。'
  },
  section2Title: {
    en: '2. Sources of Information',
    ru: '2. Источники данных',
    zh: '2. 信息来源'
  },
  section2Text: {
    en: 'We may collect information directly from you, automatically from your browser or device, from your use of the service, from cookies or similar session mechanisms, and from third-party providers you choose to use, such as social login or email delivery providers.',
    ru: 'Мы можем получать данные напрямую от вас, автоматически от браузера или устройства, из вашего использования сервиса, из cookies и похожих сессионных механизмов, а также от сторонних провайдеров, которых вы решите использовать, например социальных логинов или провайдеров электронной почты.',
    zh: '我们可能直接从你处、从你的浏览器或设备自动收集信息，也可能从你使用服务的行为、cookies 或类似会话机制，以及你选择使用的第三方提供商处收集信息，例如社交登录或邮件投递提供商。'
  },
  section3Title: {
    en: '3. How We Use Information',
    ru: '3. Как мы используем данные',
    zh: '3. 我们如何使用信息'
  },
  useAccounts: {
    en: 'To create and maintain accounts.',
    ru: 'Для создания и поддержки аккаунтов.',
    zh: '用于创建和维护账户。'
  },
  useAuth: {
    en: 'To authenticate users and maintain sessions.',
    ru: 'Для аутентификации пользователей и поддержки сессий.',
    zh: '用于认证用户并维持会话。'
  },
  useFeatures: {
    en: 'To deliver chat, file, and calling functionality.',
    ru: 'Для работы чатов, файлов и звонков.',
    zh: '用于提供聊天、文件和通话功能。'
  },
  useTransactional: {
    en: 'To send transactional messages such as email confirmation or account-related notices.',
    ru: 'Для отправки транзакционных сообщений, например подтверждения email или уведомлений по аккаунту.',
    zh: '用于发送交易类消息，例如 email 确认或账户相关通知。'
  },
  useDiagnostics: {
    en: 'To diagnose bugs, investigate abuse, monitor stability, and maintain security.',
    ru: 'Для диагностики ошибок, расследования злоупотреблений, мониторинга стабильности и поддержки безопасности.',
    zh: '用于诊断问题、调查滥用、监控稳定性并维护安全。'
  },
  useProtection: {
    en: 'To enforce our rules, protect our systems, and comply with legal requests.',
    ru: 'Для применения наших правил, защиты систем и исполнения законных запросов.',
    zh: '用于执行规则、保护系统并遵守法律请求。'
  },
  useImprove: {
    en: 'To improve, debug, or restructure the service.',
    ru: 'Для улучшения, отладки и изменения архитектуры сервиса.',
    zh: '用于改进、调试或重构服务。'
  },
  section4Title: {
    en: '4. Disclosure of Information',
    ru: '4. Передача данных',
    zh: '4. 信息披露'
  },
  discloseIntro: {
    en: 'We may disclose information:',
    ru: 'Мы можем раскрывать данные:',
    zh: '我们可能披露信息：'
  },
  discloseProviders: {
    en: 'To service providers that help us operate the product, such as hosting, database, email, authentication, and error-monitoring providers.',
    ru: 'Подрядчикам, которые помогают нам поддерживать продукт: хостинг, базы данных, email, аутентификация и мониторинг ошибок.',
    zh: '向帮助我们运营产品的服务提供商披露，例如托管、数据库、email、认证和错误监控提供商。'
  },
  discloseUsers: {
    en: 'To other users as part of the normal operation of the product, for example when your username, avatar, messages, reactions, or status are shown in chats and contact flows.',
    ru: 'Другим пользователям как часть обычной работы продукта, например когда в чатах и контактах отображаются ваше имя, аватар, сообщения, реакции или статус.',
    zh: '作为产品正常运行的一部分向其他用户披露，例如在聊天和联系人流程中显示你的用户名、头像、消息、回应或状态。'
  },
  discloseLegal: {
    en: 'When required by law, subpoena, court order, legal process, or a good-faith belief that disclosure is necessary to protect rights, users, or systems.',
    ru: 'Когда этого требует закон, судебный акт, официальный запрос или добросовестное убеждение, что раскрытие нужно для защиты прав, пользователей или систем.',
    zh: '在法律、传票、法院命令、法律程序要求，或我们善意认为披露对保护权利、用户或系统有必要时披露。'
  },
  discloseBusiness: {
    en: 'In connection with a merger, sale, restructuring, financing, acquisition, or similar transaction.',
    ru: 'В связи со слиянием, продажей, реструктуризацией, финансированием, приобретением или аналогичной сделкой.',
    zh: '在合并、出售、重组、融资、收购或类似交易相关情况下披露。'
  },
  discloseNote: {
    en: 'We do not intentionally sell personal information for third-party advertising. We also do not promise that any information disclosed to service providers, network operators, platform vendors, or other users will remain confidential once processed outside our direct control.',
    ru: 'Мы не продаём персональные данные для сторонней рекламы намеренно. Также мы не обещаем, что любые данные, переданные подрядчикам, сетевым операторам, платформам или другим пользователям, останутся конфиденциальными после обработки вне нашего прямого контроля.',
    zh: '我们不会故意出售个人信息用于第三方广告。我们也不承诺披露给服务提供商、网络运营商、平台供应商或其他用户的信息在脱离我们直接控制后仍会保持机密。'
  },
  section5Title: {
    en: '5. Cookies, Sessions, and Local Storage',
    ru: '5. Cookies, сессии и локальное хранилище',
    zh: '5. Cookies、会话和本地存储'
  },
  section5Text: {
    en: 'We use cookies and similar mechanisms primarily for authentication, session continuity, device identification, and core application operation. We may also store settings or related technical data in browser storage. If you block or delete such data, some parts of the service may stop working correctly.',
    ru: 'Мы используем cookies и похожие механизмы в первую очередь для аутентификации, продолжения сессий, идентификации устройств и базовой работы приложения. Мы также можем хранить настройки и связанные технические данные в браузерном storage. Если вы блокируете или удаляете такие данные, некоторые части сервиса могут работать некорректно.',
    zh: '我们主要使用 cookies 和类似机制进行认证、会话保持、设备识别和核心应用运行。我们也可能在浏览器存储中保存设置或相关技术数据。如果你阻止或删除这些数据，服务的某些部分可能无法正常工作。'
  },
  section6Title: {
    en: '6. Security and No Guarantee of Confidentiality',
    ru: '6. Безопасность и отсутствие гарантии конфиденциальности',
    zh: '6. 安全性及无保密保证'
  },
  section6Text1: {
    en: 'We may use HTTPS, access controls, password hashing, operational logging, and other ordinary technical measures. However, no internet service is fully secure. We do not warrant that the service will be free from breaches, outages, interception, unauthorized access, malware, data loss, misdelivery, or security failures.',
    ru: 'Мы можем использовать HTTPS, контроль доступа, хэширование паролей, техническое логирование и другие обычные меры. Однако ни один интернет-сервис не является полностью безопасным. Мы не гарантируем отсутствие взломов, сбоев, перехвата, несанкционированного доступа, вредоносного ПО, потери данных, ошибочной доставки или иных проблем безопасности.',
    zh: '我们可能使用 HTTPS、访问控制、密码哈希、运营日志和其他常规技术措施。然而，没有任何互联网服务是完全安全的。我们不保证服务不会发生泄露、中断、拦截、未经授权的访问、恶意软件、数据丢失、误投递或安全故障。'
  },
  section6Text2: {
    en: 'In particular, you should assume that chat content, attachments, account data, and technical data may be exposed, lost, corrupted, or accessed without authorization at some point. If that level of risk is not acceptable to you, do not use the service.',
    ru: 'В частности, вы должны исходить из того, что содержимое чатов, вложения, данные аккаунта и технические данные могут быть когда-либо раскрыты, потеряны, повреждены или доступны без разрешения. Если такой уровень риска для вас неприемлем, не используйте сервис.',
    zh: '尤其是，你应假设聊天内容、附件、账户数据和技术数据在某个时候可能被暴露、丢失、损坏或未经授权访问。如果你无法接受这种风险，请不要使用本服务。'
  },
  section7Title: {
    en: '7. Your Choices and Rights',
    ru: '7. Ваши права и выбор',
    zh: '7. 你的选择和权利'
  },
  section7Text: {
    en: 'Depending on your location and applicable law, you may have rights to request access, correction, deletion, or other actions regarding your information. Some requests may be limited by technical feasibility, account integrity, security, fraud prevention, legal obligations, backup retention, or our inability to verify the request.',
    ru: 'В зависимости от вашей юрисдикции и применимого закона вы можете иметь право запросить доступ, исправление, удаление или иные действия в отношении ваших данных. Некоторые запросы могут быть ограничены технической возможностью, целостностью аккаунта, безопасностью, предотвращением мошенничества, юридическими обязанностями, резервным хранением или невозможностью верифицировать запрос.',
    zh: '根据你所在地区和适用法律，你可能有权请求访问、更正、删除或对你的信息采取其他操作。某些请求可能受技术可行性、账户完整性、安全、欺诈预防、法律义务、备份保留或我们无法验证请求等因素限制。'
  },
  section8Title: {
    en: '8. Data Retention',
    ru: '8. Хранение данных',
    zh: '8. 数据保留'
  },
  section8Text: {
    en: 'We may retain information for as long as reasonably necessary to operate the service, maintain accounts, investigate abuse, comply with legal obligations, resolve disputes, enforce agreements, or maintain backups and audit records. Retention periods may vary by data type and operational need.',
    ru: 'Мы можем хранить данные столько, сколько разумно необходимо для работы сервиса, поддержки аккаунтов, расследования злоупотреблений, исполнения юридических обязанностей, разрешения споров, обеспечения договорённостей, а также поддержки резервных копий и аудиторских записей. Сроки хранения могут различаться в зависимости от типа данных и операционной необходимости.',
    zh: '我们可能在合理需要的期间内保留信息，用于运营服务、维护账户、调查滥用、遵守法律义务、解决争议、执行协议，或维护备份和审计记录。保留期限可能因数据类型和运营需要而异。'
  },
  section9Title: {
    en: '9. Children',
    ru: '9. Дети',
    zh: '9. 儿童'
  },
  section9Text: {
    en: (appName: string) =>
      `${appName} is not intended for children under 13, and we do not knowingly design the service for children. If you believe a child has provided personal information, contact us through the app support flow so we can review the report.`,
    ru: (appName: string) =>
      `${appName} не предназначен для детей младше 13 лет, и мы сознательно не создаём сервис для детей. Если вы считаете, что ребёнок предоставил персональные данные, свяжитесь с нами через поддержку внутри приложения, чтобы мы могли проверить сообщение.`,
    zh: (appName: string) =>
      `${appName} 不面向 13 岁以下儿童，我们也不会有意为儿童设计本服务。如果你认为儿童提供了个人信息，请通过应用内支持流程联系我们，以便我们审查报告。`
  },
  section10Title: {
    en: '10. Third-Party Services',
    ru: '10. Сторонние сервисы',
    zh: '10. 第三方服务'
  },
  section10Text: {
    en: 'The service may rely on third-party providers, including providers for authentication, transactional email, error monitoring, infrastructure, and browser/device capabilities. Their privacy practices, terms, outages, and security incidents are outside our direct control. When you interact with third-party services, their terms and privacy policies may also apply.',
    ru: 'Сервис может зависеть от сторонних провайдеров, включая провайдеров аутентификации, транзакционного email, мониторинга ошибок, инфраструктуры и браузерных/устройственных возможностей. Их политика конфиденциальности, условия, сбои и инциденты безопасности находятся вне нашего прямого контроля. При взаимодействии с такими сервисами могут действовать и их собственные правила.',
    zh: '本服务可能依赖第三方提供商，包括认证、交易 email、错误监控、基础设施以及浏览器/设备能力提供商。他们的隐私实践、条款、中断和安全事件不在我们的直接控制范围内。当你与第三方服务交互时，其条款和隐私政策也可能适用。'
  },
  section11Title: {
    en: '11. Changes to This Policy',
    ru: '11. Изменения политики',
    zh: '11. 本政策的变更'
  },
  section11Text: {
    en: 'We may change this Privacy Policy at any time. The latest version posted in the app or on the relevant page will control. Continued use of the service after changes means you accept the updated policy.',
    ru: 'Мы можем изменять эту политику конфиденциальности в любое время. Актуальной считается последняя версия, опубликованная в приложении или на соответствующей странице. Продолжение использования сервиса после изменений означает принятие обновлённой политики.',
    zh: '我们可能随时修改本隐私政策。以应用或相关页面发布的最新版本为准。变更后继续使用服务即表示你接受更新后的政策。'
  },
  section12Title: {
    en: '12. Contact',
    ru: '12. Контакты',
    zh: '12. 联系方式'
  },
  section12Text: {
    en: 'If you have questions or requests related to this Privacy Policy, contact support through the app settings.',
    ru: 'Если у вас есть вопросы или запросы, связанные с этой политикой конфиденциальности, свяжитесь с поддержкой через настройки приложения.',
    zh: '如果你对本隐私政策有问题或请求，请通过应用设置联系支持。'
  },
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  }
})
