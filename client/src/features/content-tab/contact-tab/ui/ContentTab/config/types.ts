import type { ContentTabType } from 'src/shared/config'

export interface IContentTabButton {
  Component: () => JSX.Element | null
  value: ContentTabType
}
