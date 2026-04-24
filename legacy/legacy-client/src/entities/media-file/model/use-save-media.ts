import { IDbMedia } from 'src/shared/config'

import { useMedia } from './use-media'

export const useSaveMedia = () => {
  const { put } = useMedia()

  const saveMedia = async (data: IDbMedia) => {
    await put(data)
  }

  return {
    saveMedia
  }
}
