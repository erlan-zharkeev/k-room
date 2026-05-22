import { ContentTab } from 'src/shared/config'

export interface ContentTabButton {
  Component: () => JSX.Element | null
  value: ContentTab
}
