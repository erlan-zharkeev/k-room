import { ISentryErrorContext } from 'common/types';
export declare const isIgnoredSentryStatus: (status?: number | null) => boolean;
export declare const shouldIgnoreSentryError: ({ message, silent, status }: ISentryErrorContext) => boolean;
