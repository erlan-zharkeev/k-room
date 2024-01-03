import { UserSettings, AsideBarButtonName, Theme } from '../../@types'

export const initUserSettings: UserSettings = {
  asideTab: AsideBarButtonName.contacts,
  currentInfoId: '1',
  selectedChatRoomId: '',
  theme: Theme.dark,
  soundOn: true,
  showTooltips: false,
  ableToShowNotification: true,
  showWallpaper: true
}
