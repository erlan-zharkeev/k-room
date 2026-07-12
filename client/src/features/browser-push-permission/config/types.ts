export type BrowserPushPermissionDialogResult = 'enabled' | 'later' | 'settings'

export type BrowserPushPermissionDialogEmit = (event: 'complete', result: BrowserPushPermissionDialogResult) => void
