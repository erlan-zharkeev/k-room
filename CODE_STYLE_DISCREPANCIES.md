# Code Style Discrepancies

## 1. Конфликты правил

Перед массовыми правками нужно синхронизировать источник истины.

- `AGENTS.md` требует хранить все TypeScript types/interfaces только в `types.ts`, а `REPOSITORY_RULES.md` разрешает `types.ts`, `*.types.ts` и директории `types`.
- `AGENTS.md` требует хранить все реальные константы только в `constants.ts`, а текущий проект массово использует `*.constants.ts`, `config/constants/*` и `i18n.ts`.
- `REPOSITORY_RULES.md` требует суффикс `Type` у всех `type` aliases и префикс `I` у всех interfaces, но текущая кодовая база почти полностью использует стиль без этих префиксов/суффиксов.
- `AGENTS.md` буквально запрещает `get` / `set`, но в проекте есть платформенные/API методы (`Map.get`, Dexie `table.get`, Redis/Mongoose-style APIs) и локальные wrapper names вроде `dexieCollectionStore().get` / `setByPath`. Перед массовым rename нужно уточнить scope правила.

## 2. Формальные расхождения, зависящие от пункта 1

Эти пункты не стоит править до решения конфликта правил выше.

- `197/198` type aliases не заканчиваются на `Type`.
  Примеры: `global-shared/src/message/types.ts`, `client/src/app/bootstrap/types.ts`, `server/src/shared/types.ts`.
- `368/371` interfaces не начинаются с `I`.
  Примеры: `server/src/modules/user/types.ts`, `global-shared/src/message/types.ts`, `client/src/widgets/chat-room-content/config/types.ts`.
- Есть exported UPPER_SNAKE_CASE constants вне файлов с basename `constants.ts`.
  В основном это `*.constants.ts` и `config/i18n.ts`, поэтому сначала нужно решить конфликт правил.

## Закрыто

- Dexie wrapper usage и direct `liveQuery` в media helpers.
- Чистые helper/data transformation функции в client model файлах.
- CSS variable fallbacks для wallpaper styles в `AppLayout.vue`.
- Socket connection monitor: event handlers и sync logic вынесены из monitor.
- Context menu models: domain action dispatch вынесен в item component models.
- Server service helpers: message/chat-room helpers и pure fixture builders вынесены в module `lib`.
- Vue bug: `LoginPage.vue` теперь использует `isFormValid.value` внутри computed.
- Backend horizontal scaling: live runtime state для presence/room-calls хранится в Redis; оставшиеся timers обслуживают TTL/heartbeat/cleanup и не являются источником live state.
