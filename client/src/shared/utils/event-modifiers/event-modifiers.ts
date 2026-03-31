export const stopPropagation = (evt: unknown) => {
  const event = evt as
    | React.MouseEvent<HTMLElement>
    | {
        domEvent: Event
      }
  const nativeEvent = 'domEvent' in event ? event.domEvent : event
  nativeEvent.stopPropagation()
}
