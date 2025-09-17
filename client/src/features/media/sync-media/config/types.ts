export interface SyncMediaDeps {
  mediaGet: (filename: string) => Promise<any | undefined>
  updateMedia: (filename: string, patch: Partial<any>) => Promise<any>
  loadMedia: (filename: string) => Promise<void>
  loadMediaHeaders: (filename: string) => Promise<{ etag?: string }>
}
