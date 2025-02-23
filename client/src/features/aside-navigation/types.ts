import { AsideBarButtonName } from 'common-types'
import { IconName } from 'src/shared/ui'

export interface ButtonsListElement {
  value: AsideBarButtonName
  iconName: IconName
  tooltip?: string
}
