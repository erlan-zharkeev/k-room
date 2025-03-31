export type ThemeType = "dark" | "light";
export type AsideBarButtonNameType =
  | "admin-panel"
  | "contacts"
  | "chat-list"
  | "calls"
  | "settings";
export type SelectedContentElementType = "info" | AsideBarButtonNameType;
export type AdminPanelModelTabType =
  | "users"
  | "calls"
  | "chat-rooms"
  | "messages";
export interface IUserSettings {
  selectedContentElement: SelectedContentElementType;
  selectedAdminPanelModelTab: AdminPanelModelTabType;
  selectedChatRoomId: string;
  ableToShowNotification: boolean;
  theme: ThemeType;
  showTooltips: boolean;
  soundOn: boolean;
  currentInfoId: string;
  showWallpaper: boolean;
}

export interface IBasicStreamSettings {
  audio: boolean;
  video: boolean;
}

export interface IStreamSettings extends IBasicStreamSettings {
  streamLoading: boolean;
}
