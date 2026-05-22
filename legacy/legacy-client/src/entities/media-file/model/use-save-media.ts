import { DbMedia } from 'src/shared/config'

import { useMedia } from './use-media'

export const useSaveMedia = () => {
  const { put } = useMedia()

  const saveMedia = async (data: DbMedia) => {
    await put(data)
  }

  return {
    saveMedia
  }
}
