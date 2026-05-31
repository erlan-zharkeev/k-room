import { toRef } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

import type { MessageDocumentCardProps } from '../config/types'

export const useMessageDocumentCard = (props: MessageDocumentCardProps) => {
  const document = toRef(props, 'document')
  const documentDownloadHref = useLiveMediaUrl(() => document.value.src)

  return {
    documentDownloadHref
  }
}
