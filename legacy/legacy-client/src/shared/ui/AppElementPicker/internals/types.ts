import { AppTag } from 'src/shared/ui/AppTags/internals/types'

export interface AppElementPickerProps {
  fromTitle: string
  toTitle: string
  availableElements: AppTag[]
  name: string
  setPickedElementIds: (ids: string[]) => void
  value?: string[]
  selectedElements?: []
  disabled?: boolean
}
