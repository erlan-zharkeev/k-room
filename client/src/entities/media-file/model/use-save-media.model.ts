import type { MediaRecord } from 'src/shared/lib'

import { useMedia } from './use-media.model'

export const useSaveMedia = () => {
  const { put } = useMedia()

  const saveMedia = async (data: MediaRecord) => {
    await put(data)
  }

  return {
    saveMedia
  }
}
