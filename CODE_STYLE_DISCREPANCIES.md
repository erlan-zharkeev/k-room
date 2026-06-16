# Code Style Discrepancies

Дата аудита: 2026-06-16.

Проверки без правок:

- `pnpm.cmd --dir client run lint:fsd` - clean
- `pnpm.cmd --dir client run lint:style` - clean
- `pnpm.cmd --dir client run lint:es` - clean
- `pnpm.cmd run lint:es` - clean

## Конфликты правил

Перед массовыми правками нужно синхронизировать источник истины.

- `AGENTS.md` требует хранить все TypeScript types/interfaces только в `types.ts`, а `REPOSITORY_RULES.md` разрешает `types.ts`, `*.types.ts` и директории `types`.
- `AGENTS.md` требует хранить все реальные константы только в `constants.ts`, а текущий проект массово использует `*.constants.ts`, `config/constants/*` и `i18n.ts`.
- `REPOSITORY_RULES.md` требует суффикс `Type` у всех `type` aliases и префикс `I` у всех interfaces, но текущая кодовая база почти полностью использует стиль без этих префиксов/суффиксов.

## Глобальные формальные расхождения

- `197/198` type aliases не заканчиваются на `Type`.
  Примеры: `global-shared/src/message/types.ts`, `client/src/app/bootstrap/types.ts`, `server/src/shared/types.ts`.
- `368/371` interfaces не начинаются с `I`.
  Примеры: `server/src/modules/user/types.ts`, `global-shared/src/message/types.ts`, `client/src/widgets/chat-room-content/config/types.ts`.
- Есть exported UPPER_SNAKE_CASE constants вне файлов с basename `constants.ts`.
  Это в основном `*.constants.ts` и `config/i18n.ts`, поэтому сначала надо решить конфликт правил.

## Server Service Helpers

Правило: service-файлы держат orchestration/business flows, non-exported stateless helpers должны жить в module `lib`.

Главные расхождения:

- `server/src/modules/fixtures/fixtures.service.ts` - около 602 строк и много top-level helper/build функций: `resolveFixtureImagePath`, `ensureAvatarLoaded`, `buildFixtureMessage`, `ensureMessages` и т.д.
- `server/src/modules/chat-rooms/chat-rooms.service.ts` - helper flow функции рядом с service orchestration, например `emitKnownUsersToUser`, `emitRoomToUsers`.
- `server/src/modules/messages/messages.service.ts` - helper `resolvePinnedMessageUpdatedPayload` в service-файле.

## Client Model Helpers

Правило: client model-файлы держат Vue/composition orchestration, stateless data transformation/building выносится в `lib`.

Главный пример:

- `client/src/widgets/chat-room-content/model/use-load-room-messages.model.ts` содержит чистые функции для load keys, range normalization и reconciliation: `createLoadKey`, `createLoadedRangesFromIndexes`, `normalizeLoadedMessageRanges`, `reconcileLoadedMessageRanges`.

## Context Menu Models

Правило: context menu model не должен содержать domain action logic для custom menu items.

Расхождения:

- `client/src/features/chat-room-context-menu/model/use-chat-room-context-menu.model.ts` подключает `useChatRoomPin`, `useChatRoomMute`, `useChatRoomMarkAsRead` и сам вызывает domain actions.
- `client/src/widgets/chat-room-content/model/use-message-context-menu.model.ts` подключает copy/reply/edit/pin/delete/forward logic и dispatch-ит действия внутри context menu model.
- `client/src/pages/contacts/model/use-contact-context-menu.model.ts` мапит contact domain actions: invite, accept, block, unblock, delete, create chat.

## Socket Monitor Models

Правило: socket monitor models должны только subscribe/unsubscribe socket events; handlers и synchronization logic должны жить в sync/model файлах.

Расхождение:

- `client/src/shared/api/socket/use-socket-connection-monitor.ts` содержит event handlers, обновляет socket status, показывает toast, делает reconnect и повторный `socket.emit`.

При этом app-level monitors выглядят лучше:

- `client/src/pages/app/model/use-message-monitor.model.ts`
- `client/src/pages/app/model/use-contact-update-monitor.model.ts`
- `client/src/pages/app/model/use-chat-room-update-monitor.model.ts`
- `client/src/pages/app/model/use-media-update-monitor.model.ts`

Они в основном подписывают/отписывают handlers, а sync logic вынесена отдельно.

## Dexie And Reactive Wrappers

Правило: Dexie wrapper уже reactive, не делать лишние computed wrappers.

Расхождения:

- `client/src/entities/message/model/use-message.model.ts` вручную строит `computed(() => new Map(messages.value.map(...)))`, хотя `dexieCollectionStore().useIndexedList()` уже умеет отдавать reactive `itemMap`.
- Прямой `liveQuery` используется вне `shared/lib/db` в `client/src/shared/lib/media/media.ts`. Возможно это осознанный media helper, но место спорное относительно правила про direct Dexie wrappers.

## Vue Component Logic

Правило: Vue-файлы должны содержать template/styles/props/emits/defineModel/computed/watchers/basic config, а business/complex state/data transformation/API logic должна жить в model.

Вероятный баг, найденный во время аудита:

- `client/src/pages/login/ui/LoginPage.vue` использует `!isFormValid` без `.value` внутри computed `isSubmitBtnDisabled`.
- Похожий template-паттерн есть в `client/src/pages/registration/ui/RegistrationPage.vue`: `:disabled="isSubmitDisabled || !isFormValid"`.

## Get / Set

Правило: не использовать getter/setter patterns и `get` / `set`.

Спорные места, требующие решения по буквальности правила:

- `client/src/shared/lib/db/lib.ts` содержит APIs вроде `get`, `setByPath`, `unsetByPath`, `patchByPath` и использует `lodash/set`.
- В проекте много `.get/.set` у `Map`, `URLSearchParams`, Redis/Mongoose/Dexie APIs. Это лучше не считать автоматически нарушением без уточнения правила.

## Backend Horizontal Scaling

Позитивное:

- Presence и room-calls runtime state в основном используют Redis.
- `server/src/modules/presence/presence.service.ts` хранит socket/user state в Redis и использует TTL/locks.
- `server/src/modules/room-calls/lib/room-call-active-state.ts` хранит active room calls в Redis.

Осторожная зона:

- `server/src/modules/presence/presence.service.ts` и `server/src/modules/room-calls/room-calls.socket.ts` используют per-instance timers. Это не выглядит явным memory-only нарушением, но поведение при нескольких server instances стоит держать под тестовым контролем.

## Styles

Позитивное:

- `stylelint` clean.
- Не найдено `&__`, `&--`, `scoped`, `:deep`.
- `enum` не найден.
- FSD checker clean.

Точечные спорные места:

- `client/src/app/layouts/auth-layout/AuthLayout.vue` содержит несколько `!important`.
- `client/src/app/layouts/app-layout/AppLayout.vue` использует CSS variable fallbacks для wallpaper styles.

## Numeric Literals

Существенного системного нарушения не найдено.

Реальные ms/byte constants в основном уже используют numeric separators. Совпадения без `_` в основном относятся к исключениям из правил: порты, hex colors, даты, SVG viewBox, confirmation codes, external ids.

## Рекомендуемый порядок зачистки

1. Сначала синхронизировать `AGENTS.md` и `REPOSITORY_RULES.md`.
2. Исправить реальные архитектурные кластеры: context menu models, socket connection monitor, server service helpers.
3. Вынести чистые helper/data transformation функции из client model файлов в `lib`.
4. Разобрать Dexie wrapper usage и direct `liveQuery` в media helpers.
5. После этого отдельно решать массовую формальную миграцию типов/интерфейсов/констант, если правила остаются такими же.
