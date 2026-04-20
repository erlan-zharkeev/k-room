import { useMedia } from 'src/entities/media-file'

import { IDbMedia } from 'src/shared/config'

export const useSaveMedia = () => {
  const { put } = useMedia()

  const saveMedia = async (data: IDbMedia) => {
    await put(data)
  }

  return {
    saveMedia
  }
}
