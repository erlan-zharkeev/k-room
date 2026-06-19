import { db } from './db'

export const openDexieDatabase = () => db.open()

export const getDexieMediaRecord = (mediaId: string) => db.media.get(mediaId)

export const getDexieMediaRecords = (mediaIds: readonly string[]) => db.media.bulkGet([...mediaIds])
