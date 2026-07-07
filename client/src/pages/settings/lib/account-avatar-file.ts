import { canvasToBlob, loadImageFromObjectUrl, resolveFileExtension } from 'src/shared/lib'

const resolveNormalizedAvatarFileName = (file: File) => {
  const name = file.name.split('.').slice(0, -1).join('.')

  return name ? `${name}.jpeg` : 'avatar.jpeg'
}

export const buildAccountAvatarFileDiagnostics = (file: File | undefined) => {
  if (!file) {
    return {
      present: false
    }
  }

  return {
    present: true,
    extension: resolveFileExtension(file.name),
    lastModified: file.lastModified || null,
    nameLength: file.name.length,
    size: file.size,
    type: file.type || null
  }
}

export const normalizeAccountAvatarFile = async (file: File) => {
  if (typeof document === 'undefined') return file
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) return file

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImageFromObjectUrl(objectUrl)
    const canvas = document.createElement('canvas')
    const width = image.naturalWidth || image.width
    const height = image.naturalHeight || image.height

    if (!width || !height) return file

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) return file

    context.drawImage(image, 0, 0)

    const blob = await canvasToBlob(canvas, 'image/jpeg')

    if (!blob) return file

    return new File([blob], resolveNormalizedAvatarFileName(file), {
      type: 'image/jpeg',
      lastModified: file.lastModified
    })
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
