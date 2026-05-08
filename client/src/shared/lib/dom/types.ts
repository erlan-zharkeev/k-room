export interface ICreateClassNameWithModifiersParams {
  rootClass: string
  modifiers: (string | boolean | undefined)[]
  additionalClassName?: string
}
export type StoppableEventType = Event | { domEvent: Event }
