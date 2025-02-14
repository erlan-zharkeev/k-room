export type Theme = "dark" | "light";
export type AsideBarButtonName = "admin-panel" | "contacts" | "chat-list" | "calls" | "settings" | "info";
export type AdminPanelModelTab = "users" | "calls" | "chat-rooms" | "messages";
export interface UserSettings {
    asideTab: AsideBarButtonName;
    selectedAdminPanelModelTab: AdminPanelModelTab;
    selectedChatRoomId: string;
    ableToShowNotification: boolean;
    theme: Theme;
    showTooltips: boolean;
    soundOn: boolean;
    currentInfoId: string;
    showWallpaper: boolean;
}
export interface StreamSettings extends BasicStreamSettings {
    streamLoading: boolean;
}
export interface BasicStreamSettings {
    audio: boolean;
    video: boolean;
}
