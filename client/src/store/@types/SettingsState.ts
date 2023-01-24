import { theme } from 'common-types'

export interface SettingsState {
  asideTab: string
  selectedChatRoomId: string
  ableToShowNotification: boolean;
  theme: theme;
  showTooltips: boolean;
  soundOn: boolean;
}
