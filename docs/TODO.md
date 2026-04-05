# TODO

This file is used to store implementation plans, follow-up tasks, and temporary work notes for the repository.

## Backlog

1. Extract `LocalizedTextMapType<string | ((msg: string) => string)>` into a named type (e.g. `LocalizedTextOrFnMapType`) in `common/types/language.ts` and use it across all i18n files that mix static strings with dynamic functions.
2. Fill in production Resend configuration and sender data.
3. Verify real email delivery in production after domain setup.
4. Complete end-to-end registration flow check: registration -> email -> confirmation -> login.
5. Add server-side resend cooldown persistence instead of relying only on query params.
6. Add backend integration tests for auth flows: registration, login/logout, email confirmation, resend confirmation, password recovery.
7. Add Playwright e2e smoke tests for critical user flows.
8. Add the first Playwright scenarios: registration, login, password recovery.
9. Add automatic test запуск for Vitest and Playwright in the intended local/CI flow.
10. Add targeted tests for critical pure helpers and validation logic.
11. Check direct `db` usage outside `entities` and move it behind entity public APIs where needed.
12. Check `useEffect` / socket listener cleanup patterns across the project so monitor-style hooks always unregister listeners on unmount.
13. Fix `removeAllListeners()` in `use-socket-connection-monitor.ts` — replace with targeted `.off()` calls per listener to avoid killing other socket hooks.
14. Add error handling to all server socket event controllers — wrap async logic in try-catch and call the error handler in catch.
15. Replace `as` casts with `satisfies` for socket event payloads across the codebase.
16. Rename client features so names start with a verb (e.g. `monitor-info-notification-update` → `monitor-...` is fine, but non-verb prefixes like `info-notification-actualize` should become `actualize-info-notification`).
17. Fix `get-initial-info-notification-map.ts` — default param `createdAfter = Date.now()` looks inverted.
18. Remove commented-out Howl code in `use-make-call.ts` (lines 74, 141, 165, 171, 178, 196).
19. Wire `unAnsweredCalls` in `CallsButton.tsx` to real state instead of hardcoded `0`.
20. Validate `language` from socket handshake against `APP_LANGUAGE_VALUES` in `socket-auth-middleware.ts`.
21. Resolve TODO in `common/socket/config/types.ts:74` — replace `IEventUpdateChatRoom` with `IEventCreateRoom`.
22. Resolve TODO in `image.model.ts` — remove redundant `src` or `name` field.
23. Distribute payload typings in `common` across proper layers (e.g. socket event payload types should live next to their domain, not in a flat common/socket file).
24. проверить флоу что с чатом если удалить пользака что будет с чатом уже созданным как груповым так и индивидуальным.
25. что же там с картинками и их кэшем
