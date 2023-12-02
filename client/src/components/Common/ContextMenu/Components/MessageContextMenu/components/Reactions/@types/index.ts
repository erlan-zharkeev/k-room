export interface ReactionsProps {
  reactionHandler: (reaction: string) => Promise<void> | void | any
  blockedKeys: Array<string>
}
