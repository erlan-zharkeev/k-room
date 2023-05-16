export interface ShortChatListProps {
  searchString: string
  clickChat?: (userId: string) => Promise<void> | void | any
}
