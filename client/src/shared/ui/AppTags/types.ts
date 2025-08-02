export interface IAppTag {
  value: string
  label: string
  prefixSlot?: JSX.Element
}

export interface IAppTagsProps {
  tags: IAppTag[]
  onRemove?: (value: string) => void
  showCross?: boolean
  onElementClick?: (value: string) => void
  title?: string
  name?: string
}
