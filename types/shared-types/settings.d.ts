export type ThemeType = "dark" | "light";
export type AsideBarButtonNameType = "contacts" | "chat-list" | "calls" | "settings";
export type ContentTabType = "info" | AsideBarButtonNameType;
export interface IUserSettings {
    selectedContentTab: ContentTabType;
    selectedChatRoomId: string;
    showNotification: boolean;
    theme: ThemeType;
    showTooltips: boolean;
    soundOn: boolean;
    showWallpaper: boolean;
    selectedAudioInputDeviceId: string;
    selectedVideoInputDeviceId: string;
    selectedAudioOutputDeviceId: string;
}
export interface IBasicStreamSettings {
    audio: boolean;
    video: boolean;
}
export interface IStreamSettings extends IBasicStreamSettings {
    streamLoading: boolean;
}
