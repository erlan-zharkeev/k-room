import { UserSettings, AsideBarButtonName, Theme, AdminPanelModelTab } from '../../@types'

export const initUserSettings: UserSettings = {
  asideTab: AsideBarButtonName.contacts,
  selectedAdminPanelModelTab: AdminPanelModelTab.users,
  currentInfoId: '1',
  selectedChatRoomId: '',
  theme: Theme.dark,
  soundOn: true,
  showTooltips: false,
  ableToShowNotification: true,
  showWallpaper: true
}
