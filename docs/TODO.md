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

- добавить анимации удаление и добавления элементов из списка таких как чат, контакты и позже звонки(пока не реализовывать).
- раз и навсегда решить проблему с глубокими импортами import { NO_MESSAGES_PLACEHOLDER_I18N } from 'src/features/message/message-list/ui/NoMessagesPlaceholder/config', если это нормально не решить то пусть в хаски вместе с остальными фиксами залетал бы и этот. для начала понять что сейчас регулирует такие импорты.
- есть несколько элементов таких как no-messages-placeholder, Выберите чат или создайте новый которые позиционируются абсолютно внутри контейнера messsage-list. так вот их несколько может сделаешь один элемент чтобы туда пробрасывать внутрь только текст.
- проверить флоу что с чатом если удалить пользака что будет с чатом уже созданным как груповым так и индивидуальным.
