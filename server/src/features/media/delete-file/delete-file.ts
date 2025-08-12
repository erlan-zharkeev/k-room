import { getBucket, MediaBucketName } from 'entities/media'
import mongoose from 'mongoose'
import { errorToMessage, log } from 'shared-lib'

export const deleteFile = async (bucketName: MediaBucketName, id?: string) => {
  if (!id) return
  try {
    const bucket = getBucket(bucketName)
    await bucket.delete(new mongoose.Types.ObjectId(id))
  } catch (error) {
    log.error(`Failed to delete file ${id} from ${bucketName}: ${errorToMessage(error)}`)
  }
}
