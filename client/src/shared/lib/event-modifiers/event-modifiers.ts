import type { StoppableEventType } from './types'

export const stopPropagation = (evt: StoppableEventType) => {
  const nativeEvent = 'domEvent' in evt ? evt.domEvent : evt

  nativeEvent.stopPropagation()
}
