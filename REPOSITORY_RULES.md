# Repository Rules

## Architecture

1. `client` is a Vue/Tauri app organized by FSD.

Client layers:

```text
app -> pages -> widgets -> features -> entities -> shared
```

2. `server` is a Nest modular monolith.

Server areas:

```text
app -> modules -> shared
```

3. `global-shared` contains cross-runtime contracts: shared types, constants, validation schemas, endpoints, i18n helpers, and socket payloads.

4. Keep page-only logic in the page slice. Do not create one-use features.

5. Respect slice and module boundaries. Export public APIs through `index.ts` where a directory is meant to be imported from outside.

## Imports

1. Use the shortest available import path.

2. Use `src/...` for imports across client slices and server areas.

3. Use relative imports only inside the same local module, component directory, or nearby config/lib/model group.

4. Import through the nearest public API when crossing an FSD slice or server module boundary.

5. Prefer named imports and destructuring.

6. Keep import groups ordered by the configured linter rules.

## TypeScript

1. Keep types simple. Do not add excessive typing when inference is clear.

2. All `type` aliases must end with `Type`.

Use:

```ts
export type AppLanguageType = 'ru' | 'en'
export type UnknownObjectType = Record<string, unknown>
```

3. All interfaces must use the `I` prefix.

Use:

```ts
export interface IUserSchema { ... }
export interface IAppTextProps { ... }
```

4. Define named types only in dedicated type files.

Allowed locations:

- `types.ts`
- `*.types.ts`
- files inside a `types` directory

5. Do not use inline object types in logic files. Move them to a type file and import them.

6. Reuse shared types such as `UnknownObjectType`.

7. Use shared guards for `typeof` checks when one exists.

8. Do not use `enum`. Use `as const` objects and derived union types.

## Numeric Literals

1. Use numeric separators for real numeric values in TS, JS, Vue script, and Rust code when they improve readability.

Use:

```ts
const TIMEOUT_MS = 10_000
const MAX_BYTES = 1_024 * 1_024
```

2. Use separators for millisecond values, TTLs, timestamps, limits, byte sizes, and breakpoints with four or more digits.

3. Do not use separators for ports, years, versions, hex colors, confirmation codes, external IDs, URLs, env values, JSON, YAML, CSS, SVG, or generated files.

## Config And I18n

1. Put constants and defaults in config/constants files.

2. Put user-visible text and `aria-label` values in i18n config.

3. Use global `$t` in Vue templates.

4. Do not nest reserved FSD segment names unless the slice already owns a larger grouped config area.

5. The project is not in production. Keep a single IndexedDB schema version and do not add historical migrations or runtime fallback compatibility for settings shape changes.

## Vue And UI

1. Move complex template logic to computed values.

2. Keep template-only computed values in `.vue` files.

3. Do not use `defineOptions` unless required.

4. Use `AppText` and `AppHeader` for text. Do not override their styles externally.

5. Use a root block class for each component.

6. Avoid compound selectors, scoped styles, and PrimeVue utility classes.

7. Prefer `margin-bottom` for vertical spacing.

8. Prefer `v-model` for form-like controls.

9. Dexie live queries are already reactive. Do not wrap them in redundant reactive state.

## Client State

1. Direct Dexie store wrappers live in `shared/lib/db`.

2. Cross-page app state belongs in `entities`.

3. Page-only IndexedDB state may stay in the owning page slice.

4. Business writes should go through the owning entity, feature, or page model API instead of being scattered in UI code.

5. `shallowUpdate` updates only top-level fields. Build nested values explicitly before calling it.

## HTTP

1. Use `useHttp` and `doHttpRequest` for client HTTP calls.

2. `doHttpRequest` must keep throwing after interceptor handling.

3. Callers must handle the error path explicitly: catch locally, map to state, or rethrow intentionally.

4. Shared interceptor behavior does not replace local control flow.

5. The client HTTP interceptor normalizes errors, handles auth redirects, logs, and shows shared toasts. Do not document Sentry behavior there unless Sentry is added on the client.

## Server

1. Backend modules own their controllers, services, validation, models, i18n, constants, and module-local types.

2. Do not add FSD layers such as `features` or `entities` to `server/src`.

3. Cross-module imports should prefer the module public API when it exists.

4. Lower server layers throw `AppError`. Controllers and global filters convert errors to transport responses.

5. Store and send server time values as Unix millisecond timestamps.

## Styles

1. Use BEM naming for CSS classes.

2. Write full BEM selectors.

Use:

```scss
.call-modal {
}

.call-modal__body {
}

.call-modal--collapse {
}
```

3. Do not build BEM elements or modifiers through `&__...` or `&--...`.

4. Keep nesting shallow. Pseudo-classes and pseudo-elements such as `&:hover`, `&:focus`, and `&::before` are allowed.

## Sentry

1. Capture only unexpected failures.

2. Do not capture expected business or validation flows such as validation errors, auth denials, missing resources in normal flows, request cancellation, or silent errors.

3. Use project Sentry wrappers instead of raw SDK calls in feature code.

Rules:

- Description is lowercase, no period at the end
- Scope is optional, in parentheses: `refactor(client): ...`
- Single short line; no body required for routine commits
