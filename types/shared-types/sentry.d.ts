export interface ISentryErrorContext {
    message?: string | null;
    silent?: boolean | null;
    status?: number | null;
}
export declare const SENTRY_IGNORED_SUBSTRINGS: readonly ["non authorized", "unauthorized", "forbidden", "not found", "failed to fetch", "network error", "load failed", "the user aborted a request"];
