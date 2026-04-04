import { useMedia } from 'src/entities/media'

export const useDeleteMedia = () => {
  const { delete: deleteMediaById } = useMedia()

  const deleteMedia = async (id: string) => {
    await deleteMediaById(id)
  }

  return {
    deleteMedia
  }
}
