export declare const APP_LANGUAGE: {
    readonly En: "en";
    readonly Ru: "ru";
};
export declare const APP_LANGUAGE_VALUES: readonly ["en", "ru"];
export declare const APP_LANGUAGE_HEADER = "x-language";
export declare const DEFAULT_APP_LANGUAGE: "en";
export type AppLanguageType = (typeof APP_LANGUAGE_VALUES)[number];
export type LocalizedTextType<T = string> = Record<AppLanguageType, T>;
