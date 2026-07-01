import { defineI18n, i18nFormatter } from 'src/shared/lib'
export const SETTINGS_PAGE_FAQ_I18N = defineI18n('settingsPageFaq', {
  faq: {
    en: 'FAQ',
    ru: 'FAQ',
    zh: 'FAQ'
  },
  faqDescription: {
    en: 'Answers and help',
    ru: 'Ответы и помощь',
    zh: '答案和帮助'
  },
  faqSearch: {
    en: 'Search',
    ru: 'Поиск',
    zh: '搜索'
  },
  faqNoResults: {
    en: 'Nothing found',
    ru: 'Ничего не найдено',
    zh: '未找到结果'
  },
  faqContactSupport: {
    en: 'Contact support',
    ru: 'Написать в поддержку',
    zh: '联系客服'
  },
  faqOpenGuide: {
    en: 'Show guide',
    ru: 'Показать гид',
    zh: '显示指南'
  },
  faqQ1: {
    en: 'How do I change my nickname?',
    ru: 'Как изменить имя пользователя?',
    zh: '如何更改用户名？'
  },
  faqA1: {
    en: 'Go to Settings → Account. Enter a new nickname in the "Nickname" field and click "Update".',
    ru: 'Перейдите в Настройки → Аккаунт. Введите новое имя в поле «Имя пользователя» и нажмите «Обновить».',
    zh: '前往设置 → 账号，在"用户名"字段中输入新用户名，然后点击"更新"。'
  },
  faqQ2: {
    en: 'How do I change my avatar?',
    ru: 'Как изменить аватар?',
    zh: '如何更改头像？'
  },
  faqA2: {
    en: 'Go to Settings → Account. Click "Upload photo" to choose an image, or "Reset photo" to remove your current avatar.',
    ru: 'Перейдите в Настройки → Аккаунт. Нажмите «Загрузить фото», чтобы выбрать изображение, или «Сбросить фото», чтобы удалить текущий аватар.',
    zh: '前往设置 → 账号。点击"上传照片"选择图片，或点击"重置照片"删除当前头像。'
  },
  faqQ3: {
    en: 'How do I change my password?',
    ru: 'Как изменить пароль?',
    zh: '如何更改密码？'
  },
  faqA3: {
    en: 'Go to Settings → Account. Fill in the "Current password", "New password" and "Confirm password" fields, then click "Change password".',
    ru: 'Перейдите в Настройки → Аккаунт. Заполните поля «Текущий пароль», «Новый пароль» и «Повторите пароль», затем нажмите «Изменить пароль».',
    zh: '前往设置 → 账号，填写"当前密码"、"新密码"和"确认密码"字段，然后点击"修改密码"。'
  },
  faqQ4: {
    en: 'How do I switch the app language?',
    ru: 'Как переключить язык приложения?',
    zh: '如何切换应用语言？'
  },
  faqA4: {
    en: 'Go to Settings → Localization and select the desired language.',
    ru: 'Перейдите в Настройки → Локализация и выберите нужный язык.',
    zh: '前往设置 → 本地化，选择所需语言。'
  },
  faqQ5: {
    en: 'How do I change the theme?',
    ru: 'Как изменить тему?',
    zh: '如何更改主题？'
  },
  faqA5: {
    en: 'Go to Settings → Appearance and choose a colour scheme.',
    ru: 'Перейдите в Настройки → Оформление и выберите цветовую схему.',
    zh: '前往设置 → 主题，选择配色方案。'
  },
  faqQ6: {
    en: 'How do I enable or disable notifications?',
    ru: 'Как включить или отключить уведомления?',
    zh: '如何启用或禁用通知？'
  },
  faqA6: {
    en: 'Go to Settings → Notifications and toggle the switch.',
    ru: 'Перейдите в Настройки → Уведомления и переключите тумблер.',
    zh: '前往设置 → 通知，切换开关。'
  },
  faqQ7: {
    en: 'How do I clear the local storage?',
    ru: 'Как очистить локальное хранилище?',
    zh: '如何清除本地存储？'
  },
  faqA7: {
    en: 'Go to Settings → Storage and click the clear button.',
    ru: 'Перейдите в Настройки → Хранилище и нажмите кнопку очистки.',
    zh: '前往设置 → 存储，点击清除按钮。'
  },
  faqQ8: {
    en: 'Which files can I attach to a message?',
    ru: 'Какие файлы можно прикреплять к сообщению?',
    zh: '消息可以添加哪些文件？'
  },
  faqA8: {
    en: 'Use the attachment button in the message field. You can attach up to 8 files at once: images, PDF, archives, audio and video. Supported extensions: jpg, jpeg, png, gif, svg, webp, pdf, zip, rar, 7z, mp3, ogg, wav, mp4, webm, mov.',
    ru: 'Используйте кнопку вложения в поле сообщения. За раз можно прикрепить до 8 файлов: изображения, PDF, архивы, аудио и видео. Доступные расширения: jpg, jpeg, png, gif, svg, webp, pdf, zip, rar, 7z, mp3, ogg, wav, mp4, webm, mov.',
    zh: '使用消息输入框中的附件按钮。一次最多可添加 8 个文件：图片、PDF、压缩包、音频和视频。支持的扩展名：jpg、jpeg、png、gif、svg、webp、pdf、zip、rar、7z、mp3、ogg、wav、mp4、webm、mov。'
  },
  faqQ9: {
    en: 'What are the attachment size limits?',
    ru: 'Какие ограничения по размеру вложений?',
    zh: '附件大小限制是多少？'
  },
  faqA9: {
    en: 'Images, PDF files and archives can be up to 10 MB each. Audio files can be up to 20 MB. Video files can be up to 50 MB.',
    ru: 'Изображения, PDF и архивы могут быть до 10 МБ каждый. Аудиофайлы могут быть до 20 МБ. Видео может быть до 50 МБ.',
    zh: '图片、PDF 和压缩包每个最大 10 MB。音频文件最大 20 MB。视频文件最大 50 MB。'
  },
  faqQ10: {
    en: 'What can I do with a message after sending it?',
    ru: 'Что можно сделать с сообщением после отправки?',
    zh: '消息发送后可以做什么？'
  },
  faqA10: {
    en: 'Open the message actions menu to reply, forward, copy text, edit your own text message, pin or delete a message, and add reactions.',
    ru: 'Откройте меню действий сообщения, чтобы ответить, переслать, скопировать текст, отредактировать свое текстовое сообщение, закрепить или удалить сообщение, а также добавить реакцию.',
    zh: '打开消息操作菜单，可以回复、转发、复制文本、编辑自己的文本消息、置顶或删除消息，也可以添加回应。'
  },
  faqQ11: {
    en: 'Why do media files load again after I clear storage?',
    ru: 'Почему медиа загружаются заново после очистки хранилища?',
    zh: '为什么清除存储后媒体会重新加载？'
  },
  faqA11: {
    en: i18nFormatter(
      ['appName'],
      (appName: string) =>
        `${appName} keeps downloaded media in local cache so chats open faster. If you clear storage, messages stay in your chats, but images, documents, audio and video will be downloaded again when needed.`
    ),
    ru: i18nFormatter(
      ['appName'],
      (appName: string) =>
        `${appName} хранит загруженные медиа в локальном кеше, чтобы чаты открывались быстрее. После очистки хранилища сообщения остаются в чатах, но изображения, документы, аудио и видео будут загружены заново при необходимости.`
    ),
    zh: i18nFormatter(
      ['appName'],
      (appName: string) =>
        `${appName} 会把已下载的媒体保存在本地缓存中，让聊天打开得更快。清除存储后，消息仍会保留，但图片、文档、音频和视频会在需要时重新下载。`
    )
  },
  faqQ12: {
    en: 'What does persistent storage do?',
    ru: 'Что делает постоянное хранилище?',
    zh: '持久存储有什么作用？'
  },
  faqA12: {
    en: 'Persistent storage asks the browser to protect app data from automatic cleanup. It helps keep messages, settings and media cache on the device for longer.',
    ru: 'Постоянное хранилище просит браузер защитить данные приложения от автоматической очистки. Это помогает дольше сохранять сообщения, настройки и кеш медиа на устройстве.',
    zh: '持久存储会请求浏览器保护应用数据，避免被自动清理。它有助于在设备上更久地保留消息、设置和媒体缓存。'
  },
  faqQ13: {
    en: 'How do I choose a microphone, camera or speaker?',
    ru: 'Как выбрать микрофон, камеру или динамик?',
    zh: '如何选择麦克风、摄像头或扬声器？'
  },
  faqA13: {
    en: 'Go to Settings → Devices. There you can choose audio input, video input and audio output devices, and test them before a call.',
    ru: 'Перейдите в Настройки → Устройства. Там можно выбрать устройство ввода звука, камеру и устройство вывода звука, а также проверить их перед звонком.',
    zh: '前往设置 → 设备。你可以选择音频输入、视频输入和音频输出设备，并在通话前进行测试。'
  },
  faqQ14: {
    en: 'Can I change the chat background?',
    ru: 'Можно ли изменить фон чата?',
    zh: '可以更改聊天背景吗？'
  },
  faqA14: {
    en: 'Yes. Go to Settings → Appearance and upload a wallpaper for the active theme, or reset it to the default background.',
    ru: 'Да. Перейдите в Настройки → Оформление и загрузите обои для активной темы или сбросьте фон к стандартному.',
    zh: '可以。前往设置 → 外观，为当前主题上传壁纸，或将背景重置为默认。'
  },
  faqQ15: {
    en: 'Where do I check microphone, camera and screen sharing access?',
    ru: 'Где проверить доступ к микрофону, камере и демонстрации экрана?',
    zh: '在哪里检查麦克风、摄像头和屏幕共享权限？'
  },
  faqA15: {
    en: i18nFormatter(
      ['appName'],
      (appName: string) =>
        `First check Settings → Devices in ${appName} and the site permissions in the browser address bar. On Windows, open Start → Settings → Privacy & security → Microphone or Camera, then enable device access and desktop app access for the browser. On macOS, open Apple menu → System Settings → Privacy & Security → Microphone, Camera, and Screen & System Audio Recording, then allow your browser. On iPad, iOS may ask you to confirm camera or microphone access every time, even on HTTPS; this is controlled by iOS and browser permissions.`
    ),
    ru: i18nFormatter(
      ['appName'],
      (appName: string) =>
        `Сначала проверьте Настройки → Устройства в ${appName} и разрешения сайта в адресной строке браузера. На Windows: Пуск → Параметры → Конфиденциальность и безопасность → Микрофон или Камера; включите доступ к устройству и доступ для классических приложений/браузера. На macOS: меню Apple → Системные настройки → Конфиденциальность и безопасность → Микрофон, Камера, Запись экрана и системного аудио; разрешите доступ браузеру. На iPad iOS может запрашивать подтверждение доступа к камере или микрофону каждый раз даже на HTTPS; это управляется iOS и разрешениями браузера.`
    ),
    zh: i18nFormatter(
      ['appName'],
      (appName: string) =>
        `先检查 ${appName} 的设置 → 设备，以及浏览器地址栏中的网站权限。在 Windows 上，打开开始 → 设置 → 隐私和安全性 → 麦克风或摄像头，然后为浏览器启用设备访问和桌面应用访问。在 macOS 上，打开 Apple 菜单 → 系统设置 → 隐私与安全性 → 麦克风、摄像头、屏幕与系统音频录制，然后允许浏览器访问。在 iPad 上，即使使用 HTTPS，iOS 也可能每次都要求确认摄像头或麦克风访问；这是由 iOS 和浏览器权限控制的。`
    )
  },
  faqQ16: {
    en: 'How do I change my email?',
    ru: 'Как изменить email?',
    zh: '如何修改 email？'
  },
  faqA16: {
    en: 'Go to Settings → Account. Enter a new email, send the code, then enter the code from the email and click "Validate code".',
    ru: 'Перейдите в Настройки → Аккаунт. Введите новый email, отправьте код, затем введите код из письма и нажмите «Проверить код».',
    zh: '前往设置 → 账号。输入新的 email，发送验证码，然后输入邮件中的验证码并点击"验证验证码"。'
  },
  faqQ17: {
    en: 'How do I find and add contacts?',
    ru: 'Как найти и добавить контакты?',
    zh: '如何查找并添加联系人？'
  },
  faqA17: {
    en: 'Open Contacts and use search. Global search helps find users outside your contact list. Send an invite; after it is accepted, the user appears in Added.',
    ru: 'Откройте Контакты и используйте поиск. Глобальный поиск помогает найти пользователей вне вашего списка контактов. Отправьте приглашение; после принятия пользователь появится в Добавленных.',
    zh: '打开联系人并使用搜索。全局搜索可以查找联系人列表之外的用户。发送邀请；对方接受后，该用户会出现在已添加列表中。'
  },
  faqQ18: {
    en: 'What do contact statuses mean?',
    ru: 'Что означают статусы контактов?',
    zh: '联系人状态是什么意思？'
  },
  faqA18: {
    en: 'Invited means you sent a request. Invite received means the request is waiting for Accept or Decline. Blocked contacts move to the blacklist until you unblock them.',
    ru: '«Приглашен» означает, что вы отправили заявку. «Приглашение» ожидает действия «Принять» или «Отклонить». Заблокированные контакты попадают в черный список, пока вы их не разблокируете.',
    zh: '"已邀请"表示你已发送请求。"收到邀请"表示请求正在等待接受或拒绝。被拉黑的联系人会进入黑名单，直到你取消拉黑。'
  },
  faqQ19: {
    en: 'How do I create a private or group chat?',
    ru: 'Как создать личный или групповой чат?',
    zh: '如何创建私聊或群聊？'
  },
  faqA19: {
    en: 'In Chats, click "Create chat", or use the contact actions menu. Choose one accepted contact for a private chat or several contacts for a group chat. For groups, you can set a name and chat image.',
    ru: 'В Чатах нажмите «Создать чат» или используйте меню действий контакта. Выберите один подтвержденный контакт для личного чата или несколько контактов для группы. Для группы можно задать название и изображение чата.',
    zh: '在聊天中点击"创建聊天"，或使用联系人操作菜单。选择一个已接受联系人创建私聊，或选择多个联系人创建群聊。群聊可以设置名称和聊天图片。'
  },
  faqQ20: {
    en: 'What can I do from the chat actions menu?',
    ru: 'Что можно сделать в меню действий чата?',
    zh: '聊天操作菜单可以做什么？'
  },
  faqA20: {
    en: 'Open the chat actions menu to open a chat, mark it as read, pin or unpin it, mute or unmute notifications, and start an audio call. In group chats, available actions can also include editing, leaving or deleting the group.',
    ru: 'Откройте меню действий чата, чтобы открыть чат, отметить его прочитанным, закрепить или открепить, выключить или включить уведомления и начать аудиозвонок. В групповых чатах также могут быть доступны редактирование, выход или удаление группы.',
    zh: '打开聊天操作菜单，可以打开聊天、标为已读、置顶或取消置顶、静音或取消静音通知，并开始语音通话。在群聊中，还可能有编辑、退出或删除群组等操作。'
  },
  faqQ21: {
    en: 'How do I start a call?',
    ru: 'Как начать звонок?',
    zh: '如何开始通话？'
  },
  faqA21: {
    en: 'Use the chat actions menu to start an audio call, or open a chat and switch to the Call view for audio, video and screen sharing controls.',
    ru: 'Используйте меню действий чата, чтобы начать аудиозвонок, или откройте чат и переключитесь в режим «Звонок» для управления аудио, видео и демонстрацией экрана.',
    zh: '使用聊天操作菜单可以开始语音通话，或打开聊天并切换到通话视图，以控制语音、视频和屏幕共享。'
  },
  faqQ22: {
    en: 'Where can I see call history and active calls?',
    ru: 'Где посмотреть историю и активные звонки?',
    zh: '在哪里查看通话历史和活动通话？'
  },
  faqA22: {
    en: 'Open Calls to see active, missed and finished calls. The top bar also shows active or incoming calls, and you can use it to return to the related chat.',
    ru: 'Откройте Звонки, чтобы увидеть активные, пропущенные и завершенные звонки. Верхняя панель также показывает активные или входящие звонки и позволяет вернуться в связанный чат.',
    zh: '打开通话可以查看进行中、未接和已结束的通话。顶部栏也会显示活动或来电通话，并可返回相关聊天。'
  },
  faqQ23: {
    en: 'What can I control during a call?',
    ru: 'Чем можно управлять во время звонка?',
    zh: '通话中可以控制什么？'
  },
  faqA23: {
    en: 'In the Call view, you can manage microphone, camera and screen sharing, switch between focus and grid views, and use quick commands such as raise hand, ok, yes and no.',
    ru: 'В режиме «Звонок» можно управлять микрофоном, камерой и демонстрацией экрана, переключаться между фокусным режимом и сеткой, а также использовать быстрые команды: поднять руку, ок, да и нет.',
    zh: '在通话视图中，可以管理麦克风、摄像头和屏幕共享，切换焦点视图和网格视图，并使用举手、好、是、否等快捷指令。'
  },
  faqQ24: {
    en: 'How do I reopen the guide?',
    ru: 'Как снова открыть гид?',
    zh: '如何重新打开指南？'
  },
  faqA24: {
    en: 'Open Settings → FAQ and click "Show guide". The guide explains the main navigation, top bar, section list and workspace.',
    ru: 'Откройте Настройки → FAQ и нажмите «Показать гид». Гид объясняет главную навигацию, верхнюю панель, список раздела и рабочую область.',
    zh: '打开设置 → FAQ，然后点击"显示指南"。指南会说明主导航、顶部栏、分区列表和工作区。'
  },
  faqQ25: {
    en: 'How do I contact support?',
    ru: 'Как связаться с поддержкой?',
    zh: '如何联系支持？'
  },
  faqA25: {
    en: 'Open Settings -> FAQ and click "Contact support". The button opens a support chat and keeps the conversation history in the app.',
    ru: 'Откройте Настройки -> FAQ и нажмите "Написать в поддержку". Кнопка откроет чат поддержки и сохранит историю переписки в приложении.',
    zh: '打开设置 -> FAQ，然后点击“联系支持”。按钮会打开支持聊天，并在应用中保留对话历史。'
  },
  faqQ26: {
    en: 'How do I change the date and time format?',
    ru: 'Как изменить формат даты и времени?',
    zh: '如何修改日期和时间格式？'
  },
  faqA26: {
    en: 'Go to Settings → Localization and select a date and time format. Automatic uses the format from your device or browser locale.',
    ru: 'Перейдите в Настройки → Локализация и выберите формат даты и времени. Автоматический режим использует формат устройства или языка браузера.',
    zh: '前往设置 → 本地化并选择日期和时间格式。自动模式会使用设备或浏览器语言环境的格式。'
  },
  faqQ27: {
    en: 'What do notification channels mean?',
    ru: 'Что означают каналы уведомлений?',
    zh: '通知渠道是什么意思？'
  },
  faqA27: {
    en: 'In Settings → Notifications, you can turn all notifications on or off, or configure separate channels: toasts, sound, browser push and native push for messages and calls.',
    ru: 'В Настройках → Уведомления можно включить или отключить все уведомления сразу либо настроить отдельные каналы: тосты, звук, браузерные push и нативные push для сообщений и звонков.',
    zh: '在设置 → 通知中，可以开启或关闭所有通知，也可以分别配置消息和通话的应用内提示、声音、浏览器推送和原生推送。'
  },
  faqQ28: {
    en: 'Can I change email or set a password for a Google account?',
    ru: 'Можно ли изменить email или установить пароль для аккаунта Google?',
    zh: 'Google 账号可以修改 email 或设置密码吗？'
  },
  faqA28: {
    en: 'No. If the account was registered through Google, email and password are managed by Google. To unlink the account from Google, contact support.',
    ru: 'Нет. Если аккаунт зарегистрирован через Google, email и пароль управляются Google. Чтобы отвязать аккаунт от Google, напишите в поддержку.',
    zh: '不可以。如果账号是通过 Google 注册的，email 和密码由 Google 管理。如需解除账号与 Google 的绑定，请联系支持。'
  },
  faqQ29: {
    en: 'How do I open message actions on a touch device?',
    ru: 'Как открыть действия сообщения на сенсорном устройстве?',
    zh: '如何在触控设备上打开消息操作？'
  },
  faqA29: {
    en: 'Press and hold a message. This long press opens the message actions menu, where you can reply, forward, copy text, edit, pin, delete or add a reaction.',
    ru: 'Нажмите и удерживайте сообщение. Это долгое нажатие (long press) открывает меню действий сообщения: ответ, пересылку, копирование текста, редактирование, закрепление, удаление и реакции.',
    zh: '长按一条消息。长按会打开消息操作菜单，你可以回复、转发、复制文本、编辑、置顶、删除或添加回应。'
  }
})
