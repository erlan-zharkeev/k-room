export interface AppTag {
  value: string
  label: string
  prefixSlot?: JSX.Element
}

export interface AppTagsProps {
  tags: AppTag[]
  onRemove?: (value: string) => void
  showCross?: boolean
  onElementClick?: (value: string) => void
  title?: string
  name?: string
  selectedIds?: string[]
  disabled?: boolean
}
