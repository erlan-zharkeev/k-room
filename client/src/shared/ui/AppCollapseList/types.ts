export interface ICollapseItem {
  id: string
  title: string
  content?: string
  badgeName?: React.ReactNode
}

export interface IAppCollapseProps {
  items: ICollapseItem[]
  onClickCollapseEl: (id: string) => void
}
