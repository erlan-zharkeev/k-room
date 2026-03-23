import './style.scss'

import { usePickContact } from 'src/features/contact'

import { AppForm, AppText } from 'src/shared/ui'

import { useCreateChatRoom } from '../../hooks'

export const CreateChatRoomForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { isLoading, createChatRoom } = useCreateChatRoom({ onSuccess })
  const {
    contactListToPick,
    pickedContactIds,
    setPickedContactIds,
    filterQuery,
    setFilterQuery,
    isPrivateChatAlreadyExists
  } = usePickContact()

  return (
    <AppForm
      onSubmit={(formData) => createChatRoom({ formData })}
      onChange={(formData) => {
        setFilterQuery(formData.query as string)
        setPickedContactIds(formData.contactIds as string[])
      }}
      fields={{
        query: {
          value: filterQuery,
          inputType: 'text',
          placeholder: 'Find contact',
          label: 'Filter',
          hide: !(contactListToPick.length > 3)
        },
        contactIds: {
          inputType: 'element-picker',
          availableElements: contactListToPick,
          fromTitle: `Pick contacts ${pickedContactIds.length > 0 ? `(${pickedContactIds.length})` : ''}`,
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
      disabledActionBtn={isPrivateChatAlreadyExists}
      submitBtnText="Create"
      actionProcessing={isLoading}
    >
      {isPrivateChatAlreadyExists && (
        <div className="create-chat-room-form__warning">
          <AppText size="small" color="warn-color">
            Private chat with selected contact already exist, choose one more or another contact
          </AppText>
        </div>
      )}
    </AppForm>
  )
}
