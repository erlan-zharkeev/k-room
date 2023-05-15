export interface ReactionsProps {
  reactionHandler: (reaction: string) => Promise<void> | void | any
}
