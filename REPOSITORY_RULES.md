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
