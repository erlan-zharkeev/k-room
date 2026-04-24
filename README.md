# K-Room

## Requirements

- pnpm 10 as package manager
- Docker for correct development environment startup

## Development

- Enable pnpm once if needed: `corepack enable`
- Add variables to bash `RESEND_API_KEY`,`EMAIL_CONFIRM_SECRET`, `FIREBASE_API_KEY`
- Generate local HTTPS certificates once and place them in `dev-certs/`:
  - `dev-certs/k-room-dev.pem`
  - `dev-certs/k-room-dev-key.pem`
- Add `127.0.0.1 k-room-dev` to `/etc/hosts`
- Open the client at `https://k-room-dev:43101`
- Run `pnpm dev`

## Repository Rules

This document defines the working rules for this repository.

## Runtime Architecture

1. `client` is the only runtime that uses FSD and the only runtime checked by `steiger`.

Client layers:

```text
app -> pages -> widgets -> features -> entities -> shared
```

2. `server` does not use FSD.

Treat `server` as a modular monolith with these top-level areas:

```text
app -> modules -> media -> shared
```

3. On the backend, use `modules` for routes, controllers, use-case orchestration, and integration logic.

4. On the backend, keep models, schemas, module-specific types, and persistence helpers inside their owning `modules`.

Use the top-level `media` layer only for cross-module media infrastructure.

## Import Rules

1. Between modules and layers, use the public root alias path.

Use imports through the public module entrypoint, for example:

```ts
import { AppModal } from 'src/shared/ui'
import { useChatRoom } from 'src/entities/chat-room'
```

Do not import another module through a deep parent relative path when a public alias path is available:

```ts
import { AppModal } from '../../shared/ui'
```

2. Relative paths may start with `./`, do not use double dot `../`.

Use:

```ts
import { messageMapper } from './message-mapper'
import { normalizeMessage } from './lib'
import { sharedRule } from '../shared'
```

Prefer a public alias path for cross-module imports when it is available:

```ts
import { sharedRule } from 'src/features/auth/shared'
import { buildPayload } from 'src/shared/lib/build-payload'
```

Parent relative imports are allowed for local traversal inside the same module when no shorter public path exists:

```ts
import { sharedRule } from '../shared'
import { buildPayload } from '../../lib/build-payload'
```

3. Prefer the shortest local relative public path available.

If a local barrel such as `./lib`, `./config`, or `./shared` already exports the symbol, import through it instead of a deeper private file path.

Use:

```ts
import { normalizeMessage } from './lib'
import { authSchema } from './config'
```

Do not use:

```ts
import { normalizeMessage } from './lib/normalize-message'
```

4. If the target file is on the same directory level, use `./`.

Use:

```ts
import { messageMapper } from './message-mapper'
```

5. Barrel exports are an exception: in `index.ts` files, use the shortest allowed path.

```ts
export * from './db'
export * from './lib'
```

If a re-export would otherwise require `../...`, either use that local parent relative path or switch to a public alias path when it is clearer:

```ts
export * from 'src/pages/privacy-policy/ui/PrivacyPolicy/config'
```

If a UI element directory contains both component code and `config`, that directory must have its own local `index.ts`, and outer `ui/index.ts` files must re-export the element directory instead of exporting the component file and `config` separately.

Use:

```ts
// ui/ContactList/index.ts
export * from './ContactList'
export * from './config'

// ui/index.ts
export * from './ContactList'
```

Do not use:

```ts
// ui/index.ts
export * from './ContactList/ContactList'
export * from './ContactList/config'
```

6. Imports must use the shortest public path level available.

Prefer the nearest public alias entrypoint that already exports the symbol:

```ts
import { dexieKeyValueStore } from 'src/shared/lib/db'
import { useValidate } from 'src/shared/lib'
```

Do not import from a deeper path if the same symbol is available from a shorter public path:

```ts
import { dexieKeyValueStore } from 'src/shared/lib/db/lib/dexie-key-value-store'
import { useValidate } from 'src/shared/lib/hooks/use-validate/use-validate'
```

7. Do not use `enum`. Use `as const` objects instead.

Use:

```ts
export const ROUTE_NAMES = {
  Login: '/login',
  Registration: '/registration'
} as const

export type RouteNamesType = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
```

Do not use:

```ts
enum RouteNames {
  Login = '/login',
  Registration = '/registration'
}
```

## TypeScript Rules

1. All TypeScript interfaces must be named with a capital `I` prefix.

Use:

```ts
export interface IMessageListProps { ... }
export interface IContactAvatarProps { ... }
```

Do not use:

```ts
export interface MessageListProps { ... }
export interface ContactAvatarProps { ... }
```

2. Component props interfaces must end with the `Props` suffix.

Use:

```ts
export interface IMessageListProps { ... }
export interface IContactAvatarProps { ... }
```

Do not use:

```ts
export interface IMessageList { ... }
export interface IContactAvatar { ... }
```

3. Component props interfaces must be placed in `config/types.ts` within that component's directory.

Use:

```ts
// MessageList/config/types.ts
export interface IMessageListProps { room: FChatRoomType }

// MessageList/MessageList.tsx
import { IMessageListProps } from 'src/features/message/message-list/ui/MessageList/config'

export const MessageList = ({ room }: IMessageListProps) => { ... }
```

Do not define props inline:

```ts
export const MessageList = ({ room }: { room: FChatRoomType }) => { ... }
```

4. All `type` aliases must end with the `Type` suffix.

Use:

```ts
export type BannerType = 'success' | 'error' | 'info' | 'warning'
export type AppLanguageType = 'ru' | 'en'
export type DbContactType = { id: string; username: string }
```

Do not use:

```ts
export type BannerVariant = 'success' | 'error'
export type AppLanguage = 'ru' | 'en'
```

5. Do not declare named `type` aliases or `interface` definitions in regular implementation files.

Named types must live only in `types.ts` files. For UI components, place them in `config/types.ts`.

Use:

```ts
// config/types.ts
export interface IAppLinkProps { ... }
export type RegistrationFormDataType = { ... }
```

Do not use:

```ts
// AppLink.tsx
interface IAppLinkProps { ... }

// admin.options.ts
type AdminActionResponseType = { ... }
```

6. Do not declare module-level constants in regular implementation files.

Shared literals, field paths, ids, fixture maps, and similar constants must live only in `constants.ts` files.

Use:

```ts
// constants.ts
export const LAST_SEEN_PATH = 'public.lastSeen'
```

Do not use:

```ts
// admin.options.ts
const LAST_SEEN_PATH = 'public.lastSeen'
```

## Error Handling Rules

1. Only controllers may convert errors to HTTP responses via `throwHTTPError`.

Use `throwHTTPError` only at the transport boundary where `req` and `res` are handled.

2. All lower layers must throw `AppError` instead of returning HTTP errors directly.

On the client, this applies to `features`, `entities`, and `shared/lib`.

On the server, this applies to `modules`, `media`, and `shared/lib`.

When throwing `AppError`, include the correct `status`, `silent`, and `cause` values.

## Client FSD Rules

This section applies only to `client/src`.

1. A feature may contain nested subfeatures when they belong to one common domain.

This is allowed for grouped domains such as `auth`, where one top-level feature contains several focused subfeatures:

```text
features/auth/login
features/auth/logout
features/auth/registration
features/auth/password-recovery
```

2. The top-level feature must serve as the common public API for its subfeatures.

If a symbol is already re-exported from the top-level feature, import it from there:

```ts
import { LoginForm, useLogin, useRegistration } from 'src/features/auth'
```

## Server Module Rules

1. The backend is organized as a modular monolith, not as FSD.

Do not reintroduce `features` or `entities` as top-level server layers.

2. A backend module owns its transport entrypoints and orchestration.

Typical contents of `server/src/modules/<name>` are routes, controllers, validators, scenario helpers, and module-local `shared`.

3. A backend module owns its persistence-level code and data contracts.

Typical contents of `server/src/modules/<name>` are controllers, routes, validators, config, models, schemas, and reusable read/write helpers for that module.

Model files on the backend live directly in their owning module, for example `server/src/modules/user/user.model.ts`.

Do not add an extra `model/` folder when filenames already carry the `*.model.ts` suffix.

4. A dedicated top-level `media` layer is allowed for infrastructure shared across modules.

Typical contents of `server/src/media` are bucket setup, upload helpers, stream helpers, and shared media config.

5. Cross-module imports on the backend should prefer the module or media root public API.

Use:

```ts
import { updateTokens } from 'src/modules/auth'
import { UserModel } from 'src/modules/user'
import { multerUploader } from 'src/media'
```

Avoid deep private imports when the same symbol is already exported from the module root.

## API Request Rules

1. `doRequest` must keep throwing after interceptor handling.

`useApi` and the API interceptor are responsible only for shared behavior:

- normalizing transport and backend errors
- showing shared notifications
- handling global cases such as `401` and `403`

They must not silently convert a failed request into a fake success result.

2. Any feature or page that calls `doRequest` must make an explicit decision about the error path.

After `doRequest(...)`, the caller must do exactly one of the following:

- catch the error locally and stop it there if the interceptor behavior is already sufficient
- catch the error locally and map it to feature state
- intentionally rethrow it to a higher layer

Do not leave request promises unhandled.

Use:

```ts
try {
  await doRequest('post', AuthEndpointsEnum.Registration, payload)
} catch {
  // Error is already normalized and notified by the API layer.
}
```

Use:

```ts
try {
  await doRequest('post', UserEndpointsEnum.EditUserData, payload)
} catch (error) {
  setFormError(getHandledErrorMessage(error))
}
```

Do not use:

```ts
const onSubmit = (payload: FormType) => {
  doRequest('post', AuthEndpointsEnum.Registration, payload)
}
```

3. Shared API notifications do not replace local control flow.

The fact that the interceptor already shows a notification does not mean the caller may ignore the returned promise. If the feature does not need any local recovery logic, it must still catch the error explicitly to avoid `Uncaught (in promise)`.

4. Do not log or send API errors to Sentry manually in feature catch blocks.

The interceptor automatically captures all `doRequest` errors to Sentry. Adding `log` or `frontCaptureSentryException` in a feature catch block duplicates that. Only use `log` or `frontCaptureSentryException` manually for non-API errors (e.g. WebRTC, device, browser API failures).

Do not use:

```ts
} catch (error) {
  log('error', 'Registration error', error)
}
```

Use:

```ts
} catch {
  // Error is already normalized, notified, and captured by the API layer.
}
```

5. Use `handleRuntimeError` for non-API errors.

For errors that originate outside `doRequest` (WebRTC, device APIs, Firebase SDK, browser APIs), use `handleRuntimeError` from `src/shared/lib`. It logs to the console and sends to Sentry in one call.

```ts
import { handleRuntimeError } from 'src/shared/lib'

} catch (error) {
  handleRuntimeError('Failed to get user media', error)
}
```

Do not call `log` and `frontCaptureSentryException` separately for these cases.

Avoid importing from a deeper subfeature path when the same symbol is available from the parent feature:

```ts
import { useLogin } from 'src/features/auth/login'
import { useRegistration } from 'src/features/auth/registration'
```

3. Subfeatures inside one feature should stay focused and independent by responsibility.

The parent feature groups related behavior, but each nested subfeature should still represent one concrete capability, UI flow, or integration point.

## Client Store Rules

1. Direct work with Dexie stores must stay inside `entities`.

`features`, `widgets`, `pages`, and `shared/ui` must not call Dexie tables or store wrappers directly.

Use:

```ts
const { addMessage, replaceAll } = useChatRoom()
```

Do not use:

```ts
await db['chat-rooms'].clear()
await chatRoomStore.replaceAll(rooms)
```

2. `entities` may expose only base store methods and reusable read helpers.

Allowed examples:

- state values from the store
- base persistence methods such as `put`, `reset`, `replaceAll`, `shallowUpdate`
- reusable read helpers such as `getById`, `isRead`, `isThemeDark`

3. Business write operations must go through `features`.

If a UI action changes store state as part of an application scenario, that write must be wrapped in a feature-level hook or action instead of being performed directly from UI code.

4. Key-value store updates are shallow by contract.

Methods named `shallowUpdate` update only top-level fields. For nested objects, explicitly build the next top-level value before calling `shallowUpdate`.

Use:

```ts
settings.shallowUpdate({
  messageScrollByRoom: {
    ...settings.messageScrollByRoom,
    [roomId]: { firstVisibleItemId }
  }
})
```

Do not assume deep merge behavior from `shallowUpdate`.

## Config Rules

1. Global repository-level config files should live in the repository root.

Use root-level files for shared top-level configuration such as TypeScript, ESLint, Prettier, Playwright, or other cross-project tooling config.

Use:

```text
tsconfig.json
prettier.config.cjs
playwright.config.ts
```

2. Root entrypoints should be thin proxies only when a tool or editor requires a specific filename.

Use a short root file only when discovery from the repository root is needed:

```json
// tsconfig.json
{
  "extends": "./tsconfig.node.json",
  "include": ["./playwright.config.ts", "./e2e/**/*.ts"]
}
```

Do not recreate a dedicated root `config/` directory for shared tool config.

## Internal Shared Rules

1. A layer may contain its own internal shared sublayer for code reused only inside that layer.

2. Such internal shared sublayers must be named `shared`.

Use names like:

```text
modules/chat-room/shared
modules/user/shared
widgets/some-widget/shared
```

Do not use alternative names for the same role:

```text
modules/chat-room/internal
modules/user/common
widgets/some-widget/lib
```

3. `shared` is internal to its layer and should not become a cross-layer public API by default.

## Directory Index Rules

1. Add `index.ts` only to directories that intentionally expose a local or public API.

Use:

```text
chat-room/
  shared/
    lib/
      index.ts
      transform-room-data.ts
```

Do not create a same-name wrapper directory for a single file when that folder has no extra local context:

```text
io/
  io.ts
```

Prefer:

```text
io.ts
```

2. Imports should target the directory public API through its `index.ts`, not a file path, whenever that directory already exposes an index entrypoint.

## Directory Purpose Rules

1. `hooks` directories are used for composables and hooks only.

Place logic such as `useSomething`, `useFeatureAction`, `useFeatureMonitor` in `hooks`.

2. `config` directories are used for constants, types, and other configuration-shaped declarations.

Typical contents of `config`:

```text
constants.ts
types.ts
message.ts
schema.ts
```

3. `lib` directories are used for utility functions and helper logic.

Place pure helpers, transformers, formatters, mappers, and other reusable implementation utilities in `lib`.

4. Do not mix these responsibilities.

Examples:

```text
hooks/use-chat-room.ts
config/constants.ts
config/types.ts
lib/transform-room-data.ts
lib/get-message-group-date-label.ts
```

5. If a component exists only to split one parent component and is not reused elsewhere, keep it inside that parent component in a `components` directory.

Use:

```text
ForwardMessageModal/
  components/
    ShortChatList/
      index.ts
      ShortChatList.tsx
      style.scss
      config/
        index.ts
        types.ts
  ForwardMessageModal.tsx
```

Do not lift such local split-only components to the feature root or neighboring public directories when they are only implementation details of one parent component.

## Data Rules

1. All date and time values on the server must be stored and transmitted as numeric Unix millisecond timestamps (`number` type).

Do not use `Date` objects, ISO strings, or `String(Date.now())` when storing or sending time values.

Use:

```ts
createdAt: Date.now()
expiresAt: Date.now() + SOME_INTERVAL_MS
```

Do not use:

```ts
createdAt: new Date()
createdAt: String(Date.now())
createdAt: new Date().toISOString()
```

2. Named time interval constants belong in `config/constants.ts` of the feature that owns them.

Use:

```ts
// config/constants.ts
export const CODE_LIFE_MS = 1000 * 60 * 15
```

Do not define interval constants inline inside controllers or lib files.

3. Static arrays used as configuration must use `as const`.

## Class Name Rules

1. When building BEM-style class names with modifiers, use `createClassNameWithModifiers`.

Use:

```ts
const className = createClassNameWithModifiers({
  rootClass: 'message-list-el',
  modifiers: [message.isSelf ? 'self' : 'interlocutor']
})
```

Do not build modifier classes manually with template strings:

```ts
className={`message-list-el message-list-el--${message.isSelf ? 'self' : 'interlocutor'}`}
```

2. Manual `className` string concatenation is acceptable only for plain static class names without modifier-building logic.

## Style Rules

1. The project uses BEM naming for CSS classes.

## Sentry Rules

1. Capture only unexpected failures in Sentry.

Send errors to Sentry only when they indicate a bug, broken invariant, critical integration failure, data loss risk, unhandled exception, or unexpected server-side failure.

Examples:

```ts
frontCaptureSentryException(new Error('Unexpected media stream failure'))
serverCaptureSentryException(error)
serverCaptureSentryHttpError({ message: 'Unexpected database failure', status: StatusEnum.Server })
```

2. Do not capture expected business or validation flows.

Do not send handled validation errors, authentication denials, permission denials, missing resources in normal flows, cancelled requests, silent errors, or other expected user-facing states.

Examples of errors that should not be captured:

```text
400 BadRequest
401 NotAuth
403 Forbidden
404 NotFound
form validation errors
email not confirmed
request cancellation
```

3. Use the project Sentry wrappers instead of direct ad hoc capture calls in feature code.

Use:

```ts
frontCaptureSentryException(error)
serverCaptureSentryException(error)
serverCaptureSentryHttpError({ message, status, silent })
```

Avoid scattering raw SDK calls across feature code when a project wrapper already exists.

Use block, element, and modifier naming consistently:

```scss
.call-modal {
}
.call-modal__body {
}
.call-modal--collapse {
}
```

2. Do not build BEM elements or modifiers in SCSS through `&__...` or `&--...`.

Write full explicit selectors instead:

```scss
.call-modal {
}

.call-modal__body {
}

.call-modal--collapse {
}
```

Do not use nested BEM construction like:

```scss
.call-modal {
  &__body {
  }
  &--collapse {
  }
}
```

Pseudo-classes and similar state selectors like `&:hover` remain allowed.

3. Nested selectors should be used sparingly.

Allowed:

- pseudo-classes and pseudo-elements such as `&:hover`, `&:focus`, `&::before`
- local library overrides like `.ant-*` when they are scoped to the current block
- shallow nesting for nearby contextual styling only

Avoid:

- deep class-in-class-in-class selector chains
- styling one BEM class only through another BEM class wrapper
- relying on DOM structure when an explicit class selector would be clearer

As a rule of thumb, nesting should stay shallow. If styling starts depending on multiple nested class levels, rewrite it into explicit selectors.

---

## Commit Rules

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope?): description
```

Types:

- `feat` — new feature
- `fix` — bug fix
- `chore` — tooling, config, dependencies
- `refactor` — code restructuring without feature or fix
- `test` — adding or updating tests
- `docs` — documentation only

Rules:

- Description is lowercase, no period at the end
- Scope is optional, in parentheses: `refactor(client): ...`
- Single short line; no body required for routine commits

## TODO

This file is used to store implementation plans, follow-up tasks, and temporary work notes for the repository.

## Backlog

1. Extract `LocalizedTextMapType<string | ((msg: string) => string)>` into a named type (e.g. `LocalizedTextOrFnMapType`) in `shared/language/types.ts` and use it across all i18n files that mix static strings with dynamic functions.
2. Fill in production Resend configuration and sender data.
3. Verify real email delivery in production after domain setup.
4. Complete end-to-end registration flow check: registration -> email -> confirmation -> login.
5. Add server-side resend cooldown persistence instead of relying only on query params.
6. Add backend integration tests for auth flows: registration, login/logout, email confirmation, resend confirmation, password recovery.
7. Add Playwright e2e smoke tests for critical user flows.
8. Add the first Playwright scenarios: registration, login, password recovery.
9. Add automatic test запуск for Vitest and Playwright in the intended local/CI flow.
10. Add targeted tests for critical pure helpers and validation logic.
11. Check direct `db` usage outside client `entities` / server module-owned persistence APIs and move it behind the corresponding public APIs where needed.
12. Check `useEffect` / socket listener cleanup patterns across the project so monitor-style hooks always unregister listeners on unmount.
13. Fix `removeAllListeners()` in `use-socket-connection-monitor.ts` — replace with targeted `.off()` calls per listener to avoid killing other socket hooks.
14. Add error handling to all server socket event controllers — wrap async logic in try-catch and call the error handler in catch.
15. Replace `as` casts with `satisfies` for socket event payloads across the codebase.
16. Rename client features so names start with a verb (e.g. `monitor-info-notification-update` → `monitor-...` is fine, but non-verb prefixes like `info-notification-actualize` should become `actualize-info-notification`).
17. Fix `get-initial-info-notification-map.ts` — default param `createdAfter = Date.now()` looks inverted.
18. Remove commented-out Howl code in `use-make-call.ts` (lines 74, 141, 165, 171, 178, 196).
19. Wire `unAnsweredCalls` in `CallsButton.tsx` to real state instead of hardcoded `0`.
20. Validate `language` from socket handshake against `APP_LANGUAGE_VALUES` in `socket-auth-middleware.ts`.
21. Resolve TODO in `shared/socket/types.ts:74` — replace `IEventUpdateChatRoom` with `IEventCreateRoom`.
22. Resolve TODO in `image.model.ts` — remove redundant `src` or `name` field.
23. Distribute payload typings in `shared` across proper layers (e.g. socket event payload types should live next to their domain, not in a flat shared/socket file).
24. проверить флоу что с чатом если удалить пользака что будет с чатом уже созданным как груповым так и индивидуальным.
25. что же там с картинками и их кэшем
