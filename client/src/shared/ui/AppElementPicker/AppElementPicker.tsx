import { useMemo } from 'react'

import { AppTags } from 'src/shared/ui'

import type { IAppElementPickerProps } from './types'

export const AppElementPicker = ({
  availableElements,
  fromTitle,
  toTitle,
  name,
  value = [],
  setPickedElementIds
}: IAppElementPickerProps) => {
  const fromTags = useMemo(
    () => availableElements.filter((el) => !value.includes(el.value)),
    [availableElements, value]
  )

  const toTags = useMemo(() => availableElements.filter((el) => value.includes(el.value)), [availableElements, value])

  return (
    <div className="app-element-picker">
      <AppTags
        title={fromTitle}
        tags={fromTags}
        onElementClick={(val) => {
          setPickedElementIds(value.includes(val) ? value.filter((v) => v !== val) : [...value, val])
        }}
      />
      <div className="divider" />
      <AppTags
        title={toTitle}
        tags={toTags}
        name={name}
        onRemove={(val) => setPickedElementIds(value.filter((v) => v !== val))}
      />
    </div>
  )
}
