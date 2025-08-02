import { ContentTabType } from 'common-types'

export interface IContentTabButton {
  Component: () => JSX.Element | null
  value: ContentTabType
}
