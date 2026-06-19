# Repository Rules

## Architecture

1. `client` is a Vue/Tauri app organized by FSD:

```text
app -> pages -> widgets -> features -> entities -> shared
```

2. `server` is a Nest modular monolith:

```text
app -> modules -> shared
```

3. `global-shared` contains cross-runtime contracts: types, constants, validation schemas, endpoints, i18n helpers, and socket payloads.

4. Respect slice and module boundaries. Export public APIs through `index.ts` when a directory is imported from outside.

5. Keep page-only logic in the page slice. Do not create one-use features.

6. Keep orchestration in model/service files. Move stateless helpers to the owning module or slice `lib`.

7. Feature slice names should describe a user-facing capability or interaction. Prefer action-oriented names when the feature is a clear action, for example `select-language`, `pin-chat-room`, or `update-profile`. Do not force artificial verbs for sessions, status displays, navigation surfaces, or grouped capability areas.

## Imports

1. Use the shortest valid import path.

2. Use `src/...` for imports across client slices and server areas.

3. Use relative imports only inside the same local module, component directory, or nearby config/lib/model group.

4. Import through the nearest public API when crossing an FSD slice or server module boundary.

5. Prefer named imports and destructuring.

6. Keep import groups ordered by the configured linter rules.

## TypeScript

1. Keep types simple and rely on inference when it is clear.

2. Type aliases and interfaces use descriptive PascalCase names. Do not add mechanical `Type` suffixes or `I` prefixes.

3. Use semantic suffixes only when they clarify the role: `Props`, `Emits`, `Params`, `Options`, `Payload`, `Response`, `State`, `Kind`, `Map`, `Record`, etc.

4. Named shared/exported types must live in dedicated type files:

- `types.ts`
- `*.types.ts`
- files inside a `types` directory

5. Use `types.ts` for small modules, `*.types.ts` or a local `types` directory for larger independent type domains.

6. Do not move unrelated types into one giant file.

7. Do not declare shared/exported inline object types in logic files. Move them to a type file and import them.

8. Local non-exported helper types may stay near implementation only when they are tiny and not reused.

9. Use `import type`, inline `type` specifiers, and `export type` for type-only imports and exports.

10. Reuse shared types such as `UnknownObject` and shared guards for `typeof` checks when they exist.

11. Do not use `enum`. Prefer string literal union types for closed string domains when values are only compared, assigned, or passed through typed APIs.
12. Use `as const` arrays for closed domains that are also needed as runtime lists, such as validation allow-lists, schema enums, iteration, or select options.
13. Use `as const` objects for real keyed maps, defaults, config, or cases where the keys have independent runtime meaning. Do not create one-to-one string objects only to avoid writing typed string literals.

## Implementation Style

1. Write minimally sufficient code. Do not add functionality, abstractions, fallbacks, or defensive branches without a real typed code path or explicit request.

2. Avoid useless one-to-one aliases. Keep the original name unless a boundary rename adds real domain meaning.

3. Prefer destructuring when extracting multiple guaranteed fields from the same typed object.

4. Split conditions with three or more parts into named booleans. Name complex or multi-line conditions before using them.

5. Use required schema/type fields directly. Do not wrap them in `?? []`, `?? {}`, optional chaining, duplicate existence checks, or deduplication.

6. Prefer `condition && value` over `condition ? value : undefined` when `false` is valid for the surrounding API.

## Numeric Literals

1. Use numeric separators for readable real values: milliseconds, TTLs, timestamps, limits, byte sizes, and breakpoints with four or more digits.

```ts
const TIMEOUT_MS = 10_000
const MAX_BYTES = 1_024 * 1_024
```

2. Do not use separators for ports, years, versions, hex colors, confirmation codes, external IDs, URLs, env values, JSON, YAML, CSS, SVG, or generated files.

## Config And I18n

1. Real constants, defaults, and config values must live in dedicated constant files:

- `constants.ts`
- `*.constants.ts`
- files inside a `constants` directory

2. Use `constants.ts` for small modules, `*.constants.ts` or a local `constants` directory for larger independent config domains.

3. Do not move unrelated constants into one giant file.

4. Validation schemas, environment config bundles, and framework/domain resource definitions may live in dedicated domain files such as `*.validation.ts`, `env.ts`, or `*.admin.ts`.

5. User-visible text, `aria-label` values, and translation dictionaries must live in i18n files:

- `i18n.ts`
- `*.i18n.ts`
- files inside an `i18n` directory

6. Use `i18n.ts` by default when a slice or module has one small shared dictionary.

7. Use a local `i18n` directory with `*.i18n.ts` files only when one owning area has several independent translation domains. Do not create an `i18n` directory for a single dictionary.

8. Use global `$t` in Vue templates.

9. Do not nest reserved FSD segment names unless the slice already owns a larger grouped config area.

## Vue And UI

1. Move complex template logic to computed values exposed from model files.

2. Do not declare `computed` in `.vue` files. Move derived reactive values to the nearest slice model or a component-local `use-*.model.ts` file.

3. Do not use `defineOptions` unless required.

4. Use `AppText` and `AppHeader` for text. Do not override their styles externally.

5. Use a root block class for each component.

6. Avoid compound selectors, scoped styles, and PrimeVue utility classes.

7. Prefer `margin-bottom` for vertical spacing.

8. Prefer `v-model` for form-like controls.

9. Do not implement Vue two-way bindings through computed `get` / `set` pairs. Use `defineModel`, `v-model`, or explicit update functions instead.

10. Prefer `useTemplateRef` for template refs instead of manually declared `ref` bindings.

11. Do not pass global settings, i18n labels, or similar ambient data through several component levels when the target component or model can read them locally.

## Client State

1. Client model files keep stateful Vue/composition orchestration, lifecycle/subscriptions, stores, initialization, singleton controls, and cross-module control flows. Move pure data transformation/building helpers to the owning `lib`.

2. In FSD `model` directories and component-local model files, Vue composable files use `use-*.model.ts`. Model files without `use` are reserved for stateful initialization, control, sync, or store modules such as `init*`, `initialize*`, `*-control.model.ts`, and `*.store.model.ts`.

3. Name exported functions with the `use` prefix only when they are Vue composables: functions called to attach reactive behavior, lifecycle, subscriptions, or state/actions to a component or another composable.

4. Component-local model files may live next to their component when the behavior belongs only to that component. Slice or entity orchestration belongs in the nearest `model` directory.

5. Pinia `defineStore` exports keep the Pinia `useXStore` convention.

6. Do not use the `use` prefix for one-off initialization, singleton controls, pure helpers, or plain async commands. Use direct verb/domain names instead.

7. Direct Dexie store wrappers live in `shared/lib/db`.

8. Dexie live queries are already reactive. Do not wrap them in redundant reactive state.

9. Cross-page app state belongs in `entities`.

10. Page-only IndexedDB state may stay in the owning page slice.

11. Business writes should go through the owning entity, feature, or page model API.

12. `shallowUpdate` updates only top-level fields. Build nested values explicitly before calling it.

13. Keep a single IndexedDB schema version until production. Do not add historical migrations or runtime fallback compatibility for settings shape changes yet.

14. Use VueUse timeout helpers such as `useTimeoutFn` instead of raw `setTimeout` / `clearTimeout`.

15. Socket monitor models only subscribe/unsubscribe socket events. Event handlers and state synchronization logic live in separate sync/model files.

16. Context menu models must not contain domain action logic for custom menu item components. Item-specific logic lives in the item component model.

17. Declare Vue `computed` values only in `*.model.ts` files. If a shared composable or provider needs derived reactive state, place that composable in a `*.model.ts` file.

## HTTP

1. Use `useHttp` and `doHttpRequest` for client HTTP calls.

2. `doHttpRequest` must keep throwing after interceptor handling.

3. Callers must handle the error path explicitly: catch locally, map to state, or rethrow intentionally.

4. Shared interceptor behavior does not replace local control flow.

5. The client HTTP interceptor normalizes errors, handles auth redirects, logs, and shows shared toasts. Do not document Sentry behavior there unless Sentry is added on the client.

## Response Messages

1. Backend HTTP and socket operations are the source of truth for operation result messages, both success and business failures.

2. Client code must not define operation-specific success or backend-failure copy for a request or socket action. If the backend returns a non-silent readable message, show that message.

3. If a backend response message is `silent`, the client must not show that message anywhere in the UI.

4. If an operation fails without a readable backend message, show only the shared generic operation failure fallback.

5. Client i18n may still contain UI labels, hints, local validation before a request, browser/device/transport errors, and client-only operation messages.

6. Socket ack `reason` values are for client control flow only. User-visible ack failure text must come from the backend ack message or the shared generic fallback.

7. When a screen renders backend success or error inline, disable the shared toast for that request and render `response.data.message.text` or the normalized handled error message.

## Server

1. Backend modules own their controllers, services, validation, models, i18n, constants, and module-local types.

2. In `server/src/modules/<module>`, module-root type files use `<module>.types.ts`. Use plain `types.ts` only for app/shared roots or small nested local folders.

3. In `server/src/modules/<module>`, module-root constant files use `<module>.constants.ts`. Use plain `constants.ts` only for app/shared roots or small nested local folders.

4. Service files keep orchestration/business flows. Move non-exported stateless helpers to module `lib`.

5. Do not add FSD layers such as `features` or `entities` to `server/src`.

6. Cross-module imports should prefer the module public API when it exists.

7. Lower server layers throw `AppError`. Controllers and global filters convert errors to transport responses.

8. Nest exception filters use `*.filter.ts` files and `*Filter` class names. These files are reserved for Nest `ExceptionFilter` implementations decorated with `@Catch()` and registered through `useGlobalFilters` or Nest providers.

9. Store and send server time values as Unix millisecond timestamps.

10. Design live runtime state for horizontal scaling. Use shared ephemeral storage such as Redis when state must survive routing across multiple server instances.

## Styles

1. Use BEM naming and write full selectors.

```scss
.call-modal {
}

.call-modal__body {
}

.call-modal--collapse {
}
```

2. Do not build BEM elements or modifiers through `&__...` or `&--...`.

3. Keep nesting shallow. Pseudo-classes and pseudo-elements such as `&:hover`, `&:focus`, and `&::before` are allowed.

## Sentry

1. Capture only unexpected failures.

2. Do not capture expected business or validation flows such as validation errors, auth denials, missing resources in normal flows, request cancellation, or silent errors.

3. Use project Sentry wrappers instead of raw SDK calls in feature code.

## Commits

1. Description is lowercase, no period at the end.

2. Scope is optional and written in parentheses: `refactor(client): ...`.

3. Use a single short line; no body is required for routine commits.
