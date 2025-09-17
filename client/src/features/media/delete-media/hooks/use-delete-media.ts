import { db } from 'src/shared/lib'

export const useDeleteMedia = () => {
  const deleteMedia = async (id: string) => {
    await db.media.delete(id)
  }

  return {
    deleteMedia
  }
}
