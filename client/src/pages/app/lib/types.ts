import type { MediaRecord } from 'src/shared/lib'

export type BrowserPushMediaGetter = (mediaId: string) => Promise<MediaRecord | undefined>
