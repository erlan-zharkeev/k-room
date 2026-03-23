import type { IAppTag } from '../../config'

export interface IAppElementPickerProps {
  fromTitle: string
  toTitle: string
  availableElements: IAppTag[]
  name: string
  setPickedElementIds: (ids: string[]) => void
  value?: string[]
  selectedElements?: []
  disabled?: boolean
}
