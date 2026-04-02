import './style.scss'

import { useSystem } from 'src/entities/system'

import { stopPropagation } from 'src/shared/lib'
import { AppDropdown, AppText, AppButton } from 'src/shared/ui'

export const MessageWithBindDataModalMenu = () => {
  const { messageInputData } = useSystem()
  const { imageCompression } = messageInputData

  const items = [
    {
      label: (
        <>
          <AppText>{imageCompression ? "Don't compress" : 'Compress'} image</AppText>
        </>
      ),
      handler: (evt: unknown) => {
        // dispatch(updateMessageInputData({ imageCompression: !imageCompression }))
        stopPropagation(evt)
      }
    }
  ]

  return (
    <AppDropdown
      additionalClassName="message-with-bind-data-modal-menu"
      items={items.map((item, idx) => ({
        label: item.label,
        type: 'item',
        onClick: item.handler,
        key: idx
      }))}
    >
      <AppButton prefixIconName="three-dots" borderless />
    </AppDropdown>
  )
}
