import { useMedia } from './use-media.model'

export const useDeleteMedia = () => {
  const { remove } = useMedia()

  const deleteMedia = async (id: string) => {
    await remove(id)
  }

  return {
    deleteMedia
  }
}
