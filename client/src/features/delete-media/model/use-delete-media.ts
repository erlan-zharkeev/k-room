import { useMedia } from 'src/entities/media-file'

export const useDeleteMedia = () => {
  const { remove } = useMedia()

  const deleteMedia = async (id: string) => {
    await remove(id)
  }

  return {
    deleteMedia
  }
}
