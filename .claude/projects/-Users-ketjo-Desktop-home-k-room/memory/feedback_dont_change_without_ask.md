---
name: Don't make changes without explicit request
description: User wants analysis/investigation shown first, changes only when explicitly asked
type: feedback
---

Do not make code changes unless the user explicitly asks to fix/change something. When investigating issues, show findings as text only and wait for instruction.

**Why:** User said "не меняй пока я тебя не прошу" (don't change until I ask) after changes were made proactively during investigation.

**How to apply:** When analyzing code, report findings as text only. Wait for "делай", "исправь", "поправь", "сделай" or similar explicit instruction before editing files.
