import { IconName } from 'ui/UIIcon/@types/IconName'

export enum AsideBarButtonName {
  contacts = 'contacts',
  chatList = 'chatList',
  calls = 'calls',
  settings = 'settings'
}

export interface ButtonsListElement {
  value: AsideBarButtonName
  iconName: IconName
  tooltip?: string
}
