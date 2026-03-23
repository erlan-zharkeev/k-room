import { useState } from 'react'

export const useMessageForward = () => {
  const [isOpen, setIsOpen] = useState(false)

  const forwardMessageHandler = () => {
    setIsOpen(true)
  }

  const closeForwardMessageModal = () => {
    setIsOpen(false)
  }

  return { isOpen, forwardMessageHandler, closeForwardMessageModal }
}
