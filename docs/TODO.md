# TODO

This file is used to store implementation plans, follow-up tasks, and temporary work notes for the repository.

## Current

- No active plan yet.

## Backlog

- Extract `LocalizedTextMapType<string | ((msg: string) => string)>` into a named type (e.g. `LocalizedTextOrFnMapType`) in `common/types/language.ts` and use it across all i18n files that mix static strings with dynamic functions.

- Fill in production Resend configuration and sender data.
- Verify real email delivery in production after domain setup.
- Complete end-to-end registration flow check: registration -> email -> confirmation -> login.
- Add server-side resend cooldown persistence instead of relying only on query params.
- Add backend integration tests for auth flows: registration, login/logout, email confirmation, resend confirmation, password recovery.
- Add Playwright e2e smoke tests for critical user flows.
- Add the first Playwright scenarios: registration, login, password recovery.
- Add automatic test запуск for Vitest and Playwright in the intended local/CI flow.
- Add targeted tests for critical pure helpers and validation logic.
- Check direct `db` usage outside `entities` and move it behind entity public APIs where needed.
- Check `useEffect` / socket listener cleanup patterns across the project so monitor-style hooks always unregister listeners on unmount.
- Fix `removeAllListeners()` in `use-socket-connection-monitor.ts` — replace with targeted `.off()` calls per listener to avoid killing other socket hooks.
- Add error handling to all server socket event controllers — wrap async logic in try-catch and call the error handler in catch.
- Replace `as` casts with `satisfies` for socket event payloads across the codebase.
- Rename client features so names start with a verb (e.g. `monitor-info-notification-update` → `monitor-...` is fine, but non-verb prefixes like `info-notification-actualize` should become `actualize-info-notification`).
- Fix `get-initial-info-notification-map.ts` — default param `createdAfter = Date.now()` looks inverted.
- Remove debug log `log.warn(String(socketId))` in `update-user-data/controller.ts:56`.
- Remove commented-out Howl code in `use-make-call.ts` (lines 74, 141, 165, 171, 178, 196).
- Wire `unAnsweredCalls` in `CallsButton.tsx` to real state instead of hardcoded `0`.
- Validate `language` from socket handshake against `APP_LANGUAGE_VALUES` in `socket-auth-middleware.ts`.
- Resolve TODO in `common/socket/config/types.ts:74` — replace `IEventUpdateChatRoom` with `IEventCreateRoom`.
- Resolve TODO in `image.model.ts` — remove redundant `src` or `name` field.

- проверить флоу что с чатом если удалить пользака что будет с чатом уже созданным как груповым так и индивидуальным.
- что же там с картинками и их кэшем

- A11y для shared-элементов клиента: semantic HTML, aria-label на иконочных кнопках, keyboard navigation, role для кастомных интерактивных элементов. Antd покрывает базу, но кастомные компоненты (ContactListEl, виртуальные списки) нужно проверить вручную.
