# Backlog

1. Вынести `LocalizedTextMapType<string | ((msg: string) => string)>` в именованный тип, например `LocalizedTextOrFnMapType`, в `shared/language/types.ts` и использовать его во всех i18n-файлах, где смешаны статичные строки и динамические функции.
2. Добавить backend integration tests для auth-флоу: регистрация, логин/логаут, подтверждение email, повторная отправка подтверждения, восстановление пароля.
3. Проверить прямое использование `db` вне client `entities` и вне server module-owned persistence APIs, при необходимости спрятать его за соответствующими public APIs.
4. Проверить паттерны cleanup для `useEffect` и socket listeners по проекту, чтобы monitor-style hooks всегда отписывали listeners при unmount.
5. Заменить `as` casts на `satisfies` для socket event payloads по всему codebase.
6. Разнести payload typings из `shared` по правильным слоям, например socket event payload types должны лежать рядом со своим domain, а не в плоском shared/socket file.
7. Проверить флоу: что будет с уже созданным групповым или индивидуальным чатом, если удалить пользователя.
8. Добавить анимации
9. Добавить гид
10. Сделть сайт для скачивания
11. Расширить вложения документов в сообщениях за пределы PDF: DOC/DOCX, XLS/XLSX, PPT/PPTX, JSON/XML и архивы после стабилизации PDF-only флоу.
12. Что можем сделать для безопасности
13. Какие можем типы наследовать чтобы сократить и улучшить их
14. Есть ли смысл в bun и в oxc?
15. Добавить продвинутые возможности для плееров аудио и видео
