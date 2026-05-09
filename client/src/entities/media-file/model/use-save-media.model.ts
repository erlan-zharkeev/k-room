import type { IDbMedia } from 'src/shared/lib'

import { useMedia } from './use-media.model'

export const useSaveMedia = () => {
  const { put } = useMedia()

  const saveMedia = async (data: IDbMedia) => {
    await put(data)
  }

  return {
    saveMedia
  }
}
