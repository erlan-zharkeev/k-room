export type AnimatedListItemState = 'entering' | 'present' | 'exiting'

export interface AnimatedListItem<T> {
  item: T
  key: string
  state: AnimatedListItemState
}
