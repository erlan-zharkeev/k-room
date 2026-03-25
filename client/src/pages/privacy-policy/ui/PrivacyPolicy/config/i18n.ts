import { type LocalizedTextType } from 'common-types'

export const LEGAL_INFO_PAGE_I18N = {
  title: {
    en: (appName: string) => `Legal Information for ${appName}`,
    ru: (appName: string) => `Правовая информация ${appName}`
  },
  lastUpdatedLabel: {
    en: 'Last updated:',
    ru: 'Последнее обновление:'
  },
  intro: {
    en: (appName: string) =>
      `This Privacy Policy explains what information may be collected when you use ${appName}, how that information may be used, and the limits of our responsibility.`,
    ru: (appName: string) =>
      `Эта политика конфиденциальности объясняет, какие данные могут собираться при использовании ${appName}, как они могут использоваться и где проходят пределы нашей ответственности.`
  },
  warning: {
    en: 'Important warning:',
    ru: 'Важное предупреждение:'
  },
  warningText: {
    en: (appName: string) =>
      `${appName} is a general-purpose chat and calling service. It is not designed for storing, transmitting, or protecting highly sensitive, confidential, regulated, financial, medical, government-issued, or otherwise mission-critical information. Do not use ${appName} as a secure vault, legal archive, or protected communications channel.`,
    ru: (appName: string) =>
      `${appName} — это общий сервис для чатов и звонков. Он не предназначен для хранения, передачи или защиты особо чувствительной, конфиденциальной, регулируемой, финансовой, медицинской, государственной или иной критически важной информации. Не используйте ${appName} как защищённое хранилище, юридический архив или безопасный канал связи.`
  },
  storageRisk: {
    en: 'Messages, files, account data, and technical data may be processed and stored on systems controlled by us or by our service providers. Although we may use reasonable operational measures, we do not promise or guarantee absolute security, confidentiality, availability, or loss prevention. Any use of the service is at your own risk.',
    ru: 'Сообщения, файлы, данные аккаунта и технические данные могут обрабатываться и храниться на системах, которые контролируем мы или наши подрядчики. Даже если мы используем разумные организационные меры, мы не обещаем и не гарантируем абсолютную безопасность, конфиденциальность, доступность или защиту от потери данных. Вы используете сервис на свой риск.'
  },
  section1Title: {
    en: '1. Information We Collect',
    ru: '1. Какие данные мы собираем'
  },
  section1Intro: {
    en: 'Depending on how you use the service, we may collect or receive the following categories of information:',
    ru: 'В зависимости от того, как вы используете сервис, мы можем собирать или получать следующие категории данных:'
  },
  accountData: {
    en: 'Account data such as username, email address, password hash, authentication provider, and confirmation status.',
    ru: 'Данные аккаунта: имя пользователя, email, хэш пароля, провайдер аутентификации и статус подтверждения.'
  },
  profileData: {
    en: 'Profile and social data such as avatar, contact relationships, chat-room membership, and basic status data such as online/last seen.',
    ru: 'Профильные и социальные данные: аватар, контакты, участие в чатах и базовые статусы вроде online/last seen.'
  },
  communicationData: {
    en: 'Communication data such as message content, message timestamps, reactions, replies, attachments, and related metadata.',
    ru: 'Коммуникационные данные: содержимое сообщений, время отправки, реакции, ответы, вложения и связанная метаинформация.'
  },
  technicalData: {
    en: 'Technical/session data such as cookies, refresh tokens, device identifiers, socket identifiers, browser/device details, timestamps, and similar operational logs.',
    ru: 'Технические и сессионные данные: cookies, refresh tokens, идентификаторы устройств и socket-сессий, сведения о браузере/устройстве, временные метки и похожие технические логи.'
  },
  diagnosticsData: {
    en: 'Support, diagnostic, and security data such as crash/error events and troubleshooting information.',
    ru: 'Данные поддержки, диагностики и безопасности: события ошибок, крашей и информация для разбирательства с проблемами.'
  },
  thirdPartyData: {
    en: 'Third-party sign-in data if you use social login providers.',
    ru: 'Данные стороннего входа, если вы используете социальные провайдеры авторизации.'
  },
  mediaPermissionData: {
    en: 'Device permission and media-related data when you use call features, such as audio/video device availability, permissions, and media streams needed to establish calls.',
    ru: 'Данные о разрешениях и мультимедиа при использовании звонков: доступность аудио/видео-устройств, разрешения и медиапотоки, нужные для установления вызова.'
  },
  section2Title: {
    en: '2. Sources of Information',
    ru: '2. Источники данных'
  },
  section2Text: {
    en: 'We may collect information directly from you, automatically from your browser or device, from your use of the service, from cookies or similar session mechanisms, and from third-party providers you choose to use, such as social login or email delivery providers.',
    ru: 'Мы можем получать данные напрямую от вас, автоматически от браузера или устройства, из вашего использования сервиса, из cookies и похожих сессионных механизмов, а также от сторонних провайдеров, которых вы решите использовать, например социальных логинов или email-провайдеров.'
  },
  section3Title: {
    en: '3. How We Use Information',
    ru: '3. Как мы используем данные'
  },
  useAccounts: {
    en: 'To create and maintain accounts.',
    ru: 'Для создания и поддержки аккаунтов.'
  },
  useAuth: {
    en: 'To authenticate users and maintain sessions.',
    ru: 'Для аутентификации пользователей и поддержки сессий.'
  },
  useFeatures: {
    en: 'To deliver chat, file, and calling functionality.',
    ru: 'Для работы чатов, файлов и звонков.'
  },
  useTransactional: {
    en: 'To send transactional messages such as email confirmation or account-related notices.',
    ru: 'Для отправки транзакционных сообщений, например подтверждения email или уведомлений по аккаунту.'
  },
  useDiagnostics: {
    en: 'To diagnose bugs, investigate abuse, monitor stability, and maintain security.',
    ru: 'Для диагностики ошибок, расследования злоупотреблений, мониторинга стабильности и поддержки безопасности.'
  },
  useProtection: {
    en: 'To enforce our rules, protect our systems, and comply with legal requests.',
    ru: 'Для применения наших правил, защиты систем и исполнения законных запросов.'
  },
  useImprove: {
    en: 'To improve, debug, or restructure the service.',
    ru: 'Для улучшения, отладки и изменения архитектуры сервиса.'
  },
  section4Title: {
    en: '4. Disclosure of Information',
    ru: '4. Передача данных'
  },
  discloseIntro: {
    en: 'We may disclose information:',
    ru: 'Мы можем раскрывать данные:'
  },
  discloseProviders: {
    en: 'To service providers that help us operate the product, such as hosting, database, email, authentication, and error-monitoring providers.',
    ru: 'Подрядчикам, которые помогают нам поддерживать продукт: хостинг, базы данных, email, аутентификация и мониторинг ошибок.'
  },
  discloseUsers: {
    en: 'To other users as part of the normal operation of the product, for example when your username, avatar, messages, reactions, or status are shown in chats and contact flows.',
    ru: 'Другим пользователям как часть обычной работы продукта, например когда в чатах и контактах отображаются ваше имя, аватар, сообщения, реакции или статус.'
  },
  discloseLegal: {
    en: 'When required by law, subpoena, court order, legal process, or a good-faith belief that disclosure is necessary to protect rights, users, or systems.',
    ru: 'Когда этого требует закон, судебный акт, официальный запрос или добросовестное убеждение, что раскрытие нужно для защиты прав, пользователей или систем.'
  },
  discloseBusiness: {
    en: 'In connection with a merger, sale, restructuring, financing, acquisition, or similar transaction.',
    ru: 'В связи со слиянием, продажей, реструктуризацией, финансированием, приобретением или аналогичной сделкой.'
  },
  discloseNote: {
    en: 'We do not intentionally sell personal information for third-party advertising. We also do not promise that any information disclosed to service providers, network operators, platform vendors, or other users will remain confidential once processed outside our direct control.',
    ru: 'Мы не продаём персональные данные для сторонней рекламы намеренно. Также мы не обещаем, что любые данные, переданные подрядчикам, сетевым операторам, платформам или другим пользователям, останутся конфиденциальными после обработки вне нашего прямого контроля.'
  },
  section5Title: {
    en: '5. Cookies, Sessions, and Local Storage',
    ru: '5. Cookies, сессии и локальное хранилище'
  },
  section5Text: {
    en: 'We use cookies and similar mechanisms primarily for authentication, session continuity, device identification, and core application operation. We may also store settings or related technical data in browser storage. If you block or delete such data, some parts of the service may stop working correctly.',
    ru: 'Мы используем cookies и похожие механизмы в первую очередь для аутентификации, продолжения сессий, идентификации устройств и базовой работы приложения. Мы также можем хранить настройки и связанные технические данные в браузерном storage. Если вы блокируете или удаляете такие данные, некоторые части сервиса могут работать некорректно.'
  },
  section6Title: {
    en: '6. Security and No Guarantee of Confidentiality',
    ru: '6. Безопасность и отсутствие гарантии конфиденциальности'
  },
  section6Text1: {
    en: 'We may use HTTPS, access controls, password hashing, operational logging, and other ordinary technical measures. However, no internet service is fully secure. We do not warrant that the service will be free from breaches, outages, interception, unauthorized access, malware, data loss, misdelivery, or security failures.',
    ru: 'Мы можем использовать HTTPS, контроль доступа, хэширование паролей, техническое логирование и другие обычные меры. Однако ни один интернет-сервис не является полностью безопасным. Мы не гарантируем отсутствие взломов, сбоев, перехвата, несанкционированного доступа, вредоносного ПО, потери данных, ошибочной доставки или иных проблем безопасности.'
  },
  section6Text2: {
    en: 'In particular, you should assume that chat content, attachments, account data, and technical data may be exposed, lost, corrupted, or accessed without authorization at some point. If that level of risk is not acceptable to you, do not use the service.',
    ru: 'В частности, вы должны исходить из того, что содержимое чатов, вложения, данные аккаунта и технические данные могут быть когда-либо раскрыты, потеряны, повреждены или доступны без разрешения. Если такой уровень риска для вас неприемлем, не используйте сервис.'
  },
  section7Title: {
    en: '7. Your Choices and Rights',
    ru: '7. Ваши права и выбор'
  },
  section7Text: {
    en: 'Depending on your location and applicable law, you may have rights to request access, correction, deletion, or other actions regarding your information. Some requests may be limited by technical feasibility, account integrity, security, fraud prevention, legal obligations, backup retention, or our inability to verify the request.',
    ru: 'В зависимости от вашей юрисдикции и применимого закона вы можете иметь право запросить доступ, исправление, удаление или иные действия в отношении ваших данных. Некоторые запросы могут быть ограничены технической возможностью, целостностью аккаунта, безопасностью, предотвращением мошенничества, юридическими обязанностями, резервным хранением или невозможностью верифицировать запрос.'
  },
  section8Title: {
    en: '8. Data Retention',
    ru: '8. Хранение данных'
  },
  section8Text: {
    en: 'We may retain information for as long as reasonably necessary to operate the service, maintain accounts, investigate abuse, comply with legal obligations, resolve disputes, enforce agreements, or maintain backups and audit records. Retention periods may vary by data type and operational need.',
    ru: 'Мы можем хранить данные столько, сколько разумно необходимо для работы сервиса, поддержки аккаунтов, расследования злоупотреблений, исполнения юридических обязанностей, разрешения споров, обеспечения договорённостей, а также поддержки резервных копий и аудиторских записей. Сроки хранения могут различаться в зависимости от типа данных и операционной необходимости.'
  },
  section9Title: {
    en: '9. Children',
    ru: '9. Дети'
  },
  section9Text: {
    en: (appName: string) =>
      `${appName} is not intended for children under 13, and we do not knowingly design the service for children. If you believe a child has provided personal information, contact us through the app support flow so we can review the report.`,
    ru: (appName: string) =>
      `${appName} не предназначен для детей младше 13 лет, и мы сознательно не создаём сервис для детей. Если вы считаете, что ребёнок предоставил персональные данные, свяжитесь с нами через поддержку внутри приложения, чтобы мы могли проверить сообщение.`
  },
  section10Title: {
    en: '10. Third-Party Services',
    ru: '10. Сторонние сервисы'
  },
  section10Text: {
    en: 'The service may rely on third-party providers, including providers for authentication, transactional email, error monitoring, infrastructure, and browser/device capabilities. Their privacy practices, terms, outages, and security incidents are outside our direct control. When you interact with third-party services, their terms and privacy policies may also apply.',
    ru: 'Сервис может зависеть от сторонних провайдеров, включая провайдеров аутентификации, транзакционного email, мониторинга ошибок, инфраструктуры и браузерных/устройственных возможностей. Их политика конфиденциальности, условия, сбои и инциденты безопасности находятся вне нашего прямого контроля. При взаимодействии с такими сервисами могут действовать и их собственные правила.'
  },
  section11Title: {
    en: '11. Changes to This Policy',
    ru: '11. Изменения политики'
  },
  section11Text: {
    en: 'We may change this Privacy Policy at any time. The latest version posted in the app or on the relevant page will control. Continued use of the service after changes means you accept the updated policy.',
    ru: 'Мы можем изменять эту политику конфиденциальности в любое время. Актуальной считается последняя версия, опубликованная в приложении или на соответствующей странице. Продолжение использования сервиса после изменений означает принятие обновлённой политики.'
  },
  section12Title: {
    en: '12. Contact',
    ru: '12. Контакты'
  },
  section12Text: {
    en: 'If you have questions or requests related to this Privacy Policy, contact support through the app settings.',
    ru: 'Если у вас есть вопросы или запросы, связанные с этой политикой конфиденциальности, свяжитесь с поддержкой через настройки приложения.'
  },
  back: {
    en: 'Back',
    ru: 'Назад'
  }
} as const satisfies Record<string, LocalizedTextType<any>>
