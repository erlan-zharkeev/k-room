import { useRef, useState } from 'react'

import { VirtuosoHandle } from 'react-virtuoso'

export const useMessageListScroll = () => {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  return {
    virtuosoRef,
    isAtBottom,
    setIsAtBottom
  }
}
