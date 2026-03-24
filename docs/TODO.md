# TODO

This file is used to store implementation plans, follow-up tasks, and temporary work notes for the repository.

## Current

- No active plan yet.

## Backlog

- Rewrite privacy policy.
- Buy a domain for transactional email delivery.
- Fill in production Resend configuration and sender data.
- Verify real email delivery in production after domain setup.
- Complete end-to-end registration flow check: registration -> email -> confirmation -> login.
- Add server-side resend cooldown persistence instead of relying only on query params.
- Add backend integration tests for auth flows: registration, login/logout, email confirmation, resend confirmation, password recovery.
- Add Playwright e2e smoke tests for critical user flows.
- Add the first Playwright scenarios: registration, login, password recovery.
- Add targeted tests for critical pure helpers and validation logic.
