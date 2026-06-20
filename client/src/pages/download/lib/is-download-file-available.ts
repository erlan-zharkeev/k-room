export const isDownloadFileAvailable = async (downloadUrl: string) => {
  const response = await fetch(downloadUrl, {
    method: 'HEAD',
    cache: 'no-store'
  })
  const contentType = response.headers.get('content-type') ?? ''

  return response.ok && !contentType.toLowerCase().includes('text/html')
}
