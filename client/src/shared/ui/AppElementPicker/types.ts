import { AppTag } from '../types'

export interface AppElementPickerProps {
  fromTitle: string
  toTitle: string
  availableElements: AppTag[]
  name: string
  setPickedElementIds: (ids: string[]) => void
  value?: string[]
}
