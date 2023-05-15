export interface ShortContactsListProps {
  searchString: string
  clickContact?: (userId: string) => Promise<void> | void | any
}
