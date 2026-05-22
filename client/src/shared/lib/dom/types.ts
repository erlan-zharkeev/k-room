export interface CreateClassNameWithModifiersParams {
  rootClass: string
  modifiers: (string | boolean | undefined)[]
  additionalClassName?: string
}
export type StoppableEvent = Event | { domEvent: Event }
