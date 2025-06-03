import { usePickContact } from 'src/features/contact'

import { AppForm } from 'src/shared/ui'

import { useCreateChatRoom } from '../../hooks'

export const CreateChatRoomForm = () => {
  const { isLoading, createChatRoom } = useCreateChatRoom()

  const { contactListToPick, pickedContactIds, setPickedContactIds } = usePickContact()

  return (
    <AppForm
      onSubmit={(formData) => createChatRoom({ formData })}
      onChange={(formData) => {
        setPickedContactIds(formData.contactIds as string[])
      }}
      fields={{
        contactIds: {
          inputType: 'element-picker',
          availableElements: contactListToPick,
          fromTitle: 'Pick contacts',
          toTitle: 'Chat room contacts',
          rule: { name: 'required' }
        },
        avatarFile: {
          inputType: 'file',
          design: 'avatar',
          avatarStubIcon: 'image-stub',
          avatarShape: 'square-shape',
          avatarBorderless: true,
          hide: !(pickedContactIds.length > 1),
          label: 'Chat avatar'
        },
        chatName: {
          inputType: 'text',
          placeholder: 'Type...',
          rule: { name: 'required' },
          hide: !(pickedContactIds.length > 1),
          label: 'Chat name'
        }
      }}
      submitBtnText="Create"
      actionProcessing={isLoading}
    />
  )
}
