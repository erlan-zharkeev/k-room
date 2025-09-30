import { AppTags } from 'src/shared/ui'

import type { IAppElementPickerProps } from './types'

export const AppElementPicker = ({
  availableElements,
  fromTitle,
  value = [],
  disabled,
  setPickedElementIds
}: IAppElementPickerProps) => {
  return (
    <div className="app-element-picker">
      <AppTags
        disabled={disabled}
        selectedIds={value}
        title={fromTitle}
        tags={availableElements}
        onElementClick={(val) => {
          setPickedElementIds(value.includes(val) ? value.filter((v) => v !== val) : [...value, val])
        }}
      />
    </div>
  )
}
