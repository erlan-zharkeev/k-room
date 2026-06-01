# План внедрения room-call звонков

## Решение

Звонок строим как `RoomCall`: каждый активный звонок привязан к `roomId`, а личный звонок является частным случаем комнаты из двух участников.

Первый вариант делаем через P2P mesh WebRTC и Socket.IO signaling, без SFU/media-server. Лимит активных участников одного звонка: `5`. Размер чата не меняем.

## Ограничения MVP

- В звонке одновременно максимум 5 активных участников.
- Видеозвонки и демонстрация экрана работают в рамках P2P mesh.
- Screen share публикуется как текущий видео-поток участника вместо камеры.
- Для 6+ активных участников в будущем лучше переходить на SFU.

## Выполненные блоки

1. Shared contract `RoomCall`: типы, константы, socket events, ack reasons, лимит участников.
2. Серверный модуль `room-calls`: модель данных, доступ к комнате, start/join/leave/end, media state, signaling relay.
3. Клиентская FSD-структура: `entities/room-call`, `features/room-call-session`, интеграция в `widgets/chat-room-content`.
4. Локальные media streams: микрофон, камера, экран, выбранные устройства, остановка browser screen share.
5. WebRTC peer manager для P2P mesh: offer/answer/ice, STUN config, очередь ранних ICE-кандидатов, пересборка tracks.
6. UI звонков в чате: кнопки старта, join panel, active panel с тайлами участников и controls.
7. Страница истории звонков `/calls` на данных `room-calls`.
8. Notifications и edge cases: incoming call, busy/full call, permissions, disconnect, завершение звонка.

## Проверка

- `global-shared` typecheck.
- `k-room-server` typecheck.
- `client` typecheck.
- `client` FSD lint.
- Targeted eslint для серверных и клиентских файлов звонков.
- `git diff --check`.
