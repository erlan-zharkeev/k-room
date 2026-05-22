import type { MediaRecordType } from 'src/shared/lib'

import { useMedia } from './use-media.model'

export const useSaveMedia = () => {
  const { put } = useMedia()

  const saveMedia = async (data: MediaRecordType) => {
    await put(data)
  }

  return {
    saveMedia
  }
}
