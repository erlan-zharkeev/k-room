# TODO

This file is used to store implementation plans, follow-up tasks, and temporary work notes for the repository.

## Current

- No active plan yet.

## Backlog

- Extract `LocalizedTextMapType<string | ((msg: string) => string)>` into a named type (e.g. `LocalizedTextOrFnMapType`) in `common/types/language.ts` and use it across all i18n files that mix static strings with dynamic functions.



- Rewrite privacy policy.
- Buy a domain for transactional email delivery.
- Fill in production Resend configuration and sender data.
- Verify real email delivery in production after domain setup.
- Complete end-to-end registration flow check: registration -> email -> confirmation -> login.
- Add server-side resend cooldown persistence instead of relying only on query params.
- Add backend integration tests for auth flows: registration, login/logout, email confirmation, resend confirmation, password recovery.
- Migrate all async server controllers/requests to `asyncHandler` so errors reach the common express error middleware consistently.
- Add Playwright e2e smoke tests for critical user flows.
- Add the first Playwright scenarios: registration, login, password recovery.
- Add automatic test запуск for Vitest and Playwright in the intended local/CI flow.
- Add targeted tests for critical pure helpers and validation logic.
- Check direct `db` usage outside `entities` and move it behind entity public APIs where needed.

- проверить флоу что с чатом если удалить пользака что будет с чатом уже созданным как груповым так и индивидуальным.
- что же там с картинками и их кэшем
