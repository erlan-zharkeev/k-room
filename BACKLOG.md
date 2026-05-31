# Backlog

1. Вынести `LocalizedTextMapType<string | ((msg: string) => string)>` в именованный тип, например `LocalizedTextOrFnMapType`, в `shared/language/types.ts` и использовать его во всех i18n-файлах, где смешаны статичные строки и динамические функции.
2. Добавить backend integration tests для auth-флоу: регистрация, логин/логаут, подтверждение email, повторная отправка подтверждения, восстановление пароля.
3. Проверить прямое использование persistence APIs на сервере вне module-owned boundaries; client-часть по этому пункту закрыта.
4. Проверить паттерны cleanup для `useEffect` и socket listeners по проекту, чтобы monitor-style hooks всегда отписывали listeners при unmount.
5. Разнести payload typings из `shared` по правильным слоям, например socket event payload types должны лежать рядом со своим domain, а не в плоском shared/socket file.
6. Проверить флоу: что будет с уже созданным групповым или индивидуальным чатом, если удалить пользователя.
7. Добавить анимации
8. Добавить гид
9. Сделать сайт для скачивания
10. Расширить вложения документов в сообщениях за пределы PDF: DOC/DOCX, XLS/XLSX, PPT/PPTX, JSON/XML и архивы после стабилизации PDF-only флоу.
11. Что можем сделать для безопасности
12. Какие можем типы наследовать чтобы сократить и улучшить их
13. Есть ли смысл в bun и в oxc?
