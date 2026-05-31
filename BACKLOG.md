# Backlog

1. Вынести `LocalizedTextMapType<string | ((msg: string) => string)>` в именованный тип, например `LocalizedTextOrFnMapType`, в `shared/language/types.ts` и использовать его во всех i18n-файлах, где смешаны статичные строки и динамические функции.
2. Добавить серверное хранение кулдауна повторной отправки письма вместо опоры только на query params.
3. Добавить backend integration tests для auth-флоу: регистрация, логин/логаут, подтверждение email, повторная отправка подтверждения, восстановление пароля.
4. Проверить прямое использование `db` вне client `entities` и вне server module-owned persistence APIs, при необходимости спрятать его за соответствующими public APIs.
5. Проверить паттерны cleanup для `useEffect` и socket listeners по проекту, чтобы monitor-style hooks всегда отписывали listeners при unmount.
6. Исправить `removeAllListeners()` в `use-socket-connection-monitor.ts`: заменить на точечные `.off()` для каждого listener, чтобы не ломать другие socket hooks.
7. Добавить обработку ошибок во все server socket event controllers: обернуть async logic в try-catch и вызывать error handler в catch.
8. Заменить `as` casts на `satisfies` для socket event payloads по всему codebase.
9. Разнести payload typings из `shared` по правильным слоям, например socket event payload types должны лежать рядом со своим domain, а не в плоском shared/socket file.
10. Проверить флоу: что будет с уже созданным групповым или индивидуальным чатом, если удалить пользователя.
11. Добавить анимации
12. Добавить гид
13. Обновить faq
14. Сделть сайт для скачивания
15. Расширить вложения документов в сообщениях за пределы PDF: DOC/DOCX, XLS/XLSX, PPT/PPTX, JSON/XML и архивы после стабилизации PDF-only флоу.
16. Что можем сделать для безопасности
17. Какие можем типы наследовать чтобы сократить и улучшить их
18. Есть ли смысл в bun и в oxc?
19. Добавить продвинутые возможности для плееров аудио и видео
20. Пробежаться по todo
