# Backlog

1. Вынести `LocalizedTextMapType<string | ((msg: string) => string)>` в именованный тип, например `LocalizedTextOrFnMapType`, в `shared/language/types.ts` и использовать его во всех i18n-файлах, где смешаны статичные строки и динамические функции.
2. Проверить реальную отправку email в production после настройки домена.
3. Полностью проверить флоу регистрации: регистрация -> email -> подтверждение -> логин.
4. Добавить серверное хранение кулдауна повторной отправки письма вместо опоры только на query params.
5. Добавить backend integration tests для auth-флоу: регистрация, логин/логаут, подтверждение email, повторная отправка подтверждения, восстановление пароля.
6. Проверить прямое использование `db` вне client `entities` и вне server module-owned persistence APIs, при необходимости спрятать его за соответствующими public APIs.
7. Проверить паттерны cleanup для `useEffect` и socket listeners по проекту, чтобы monitor-style hooks всегда отписывали listeners при unmount.
8. Исправить `removeAllListeners()` в `use-socket-connection-monitor.ts`: заменить на точечные `.off()` для каждого listener, чтобы не ломать другие socket hooks.
9. Добавить обработку ошибок во все server socket event controllers: обернуть async logic в try-catch и вызывать error handler в catch.
10. Заменить `as` casts на `satisfies` для socket event payloads по всему codebase.
11. Закрыть TODO в `image.model.ts`: удалить избыточное поле `src` или `name`.
12. Разнести payload typings из `shared` по правильным слоям, например socket event payload types должны лежать рядом со своим domain, а не в плоском shared/socket file.
13. Проверить флоу: что будет с уже созданным групповым или индивидуальным чатом, если удалить пользователя.
14. Подключить к месседж меню для тач устройств.
