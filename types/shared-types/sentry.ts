export interface ISentryErrorContext {
  message?: string | null;
  silent?: boolean | null;
  status?: number | null;
}

export const SENTRY_IGNORED_SUBSTRINGS = [
  "non authorized",
  "unauthorized",
  "forbidden",
  "not found",
  "failed to fetch",
  "network error",
  "load failed",
  "the user aborted a request",
] as const;
