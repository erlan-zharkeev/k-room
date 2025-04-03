import { AsideBarButtonNameType } from 'common-types'
import { AppIconName } from 'src/shared/ui'

export interface ButtonsListElement {
  value: AsideBarButtonNameType
  iconName: AppIconName
  tooltip?: string
}
