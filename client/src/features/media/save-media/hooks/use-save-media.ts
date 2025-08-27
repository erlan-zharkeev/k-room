import { IDbMedia } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useSaveMedia = () => {
  const saveMedia = async (data: IDbMedia) => {
    await db.media.put(data)
  }

  return {
    saveMedia
  }
}
