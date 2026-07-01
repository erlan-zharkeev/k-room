export type AppBadgeNavigator = Navigator & {
  clearAppBadge?: () => Promise<void>
  setAppBadge?: (contents?: number) => Promise<void>
}
