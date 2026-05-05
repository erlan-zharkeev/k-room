export const getDataUrlMimeType = (url: string) => url.match(/^data:([^;]+);/)?.[1] ?? ''
