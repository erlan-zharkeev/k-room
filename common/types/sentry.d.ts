export interface ISentryErrorContext {
    message?: string | null;
    silent?: boolean | null;
    status?: number | null;
}
export declare const SENTRY_IGNORED_SUBSTRINGS: readonly ["non authorized", "unauthorized", "forbidden", "not found", "failed to fetch", "network error", "load failed", "the user aborted a request"];
export declare const isIgnoredSentryStatus: (status?: number | null) => boolean;
export declare const shouldIgnoreSentryError: ({ message, silent, status }: ISentryErrorContext) => boolean;
