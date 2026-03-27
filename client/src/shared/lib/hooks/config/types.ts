export type AnimatedListItemStateType = 'entering' | 'present' | 'exiting'

export interface IAnimatedListItem<T> {
  item: T
  key: string
  state: AnimatedListItemStateType
}
