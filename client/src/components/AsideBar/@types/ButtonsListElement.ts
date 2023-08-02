import { AsideBarButtonName } from 'common-types'
import { IconName } from 'ui/UIIcon/@types/IconName'

export interface ButtonsListElement {
  value: AsideBarButtonName
  iconName: IconName
  tooltip?: string
}
