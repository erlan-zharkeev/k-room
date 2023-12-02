import { UserSettings, AsideBarButtonName, Theme } from '../../@types'

export const initUserSettings: UserSettings = {
  asideTab: AsideBarButtonName.contacts,
  selectedChatRoomId: '',
  ableToShowNotification: true,
  theme: Theme.dark,
  showTooltips: false,
  soundOn: true,
  currentInfoId: ''
}
