# Repository Rules

This document defines the working rules for this repository.

## Import Rules

1. All imports must be absolute.

Use imports from the project root alias, for example:

```ts
import { AppModal } from 'src/shared/ui'
import { useChatRoom } from 'src/entities/chat-room'
```

Do not use relative imports like:

```ts
import { AppModal } from '../../shared/ui'
import { useChatRoom } from '../hooks/use-chat-room'
```

Barrel exports are an exception: in `index.ts` files, use relative `export` paths.

```ts
export * from './db'
export * from './lib'
```

2. Imports must use the shortest public path level available.

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
