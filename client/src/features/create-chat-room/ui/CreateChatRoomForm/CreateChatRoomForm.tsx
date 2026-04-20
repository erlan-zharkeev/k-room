import './style.scss'

import { ICreateChatRoomFormProps, useCreateChatRoom, CREATE_CHAT_ROOM_FORM_I18N } from 'src/features/create-chat-room'
import { usePickContact } from 'src/features/pick-contact'

import { useI18n } from 'src/shared/preferences'
import { AppForm, AppText } from 'src/shared/ui'

export const CreateChatRoomForm = ({ onSuccess }: ICreateChatRoomFormProps) => {
  const { isLoading, createChatRoom } = useCreateChatRoom({ onSuccess })
  const { t } = useI18n()
  const {
    contactListToPick,
    pickedContactIds,
    setPickedContactIds,
    filterQuery,
    setFilterQuery,
    isPrivateChatAlreadyExists
  } = usePickContact()
  const fromTitle = t(CREATE_CHAT_ROOM_FORM_I18N.fromTitle) as (count: number) => string

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
          placeholder: t(CREATE_CHAT_ROOM_FORM_I18N.queryPlaceholder),
          label: t(CREATE_CHAT_ROOM_FORM_I18N.queryLabel),
          hide: !(contactListToPick.length > 3)
        },
        contactIds: {
          inputType: 'element-picker',
          availableElements: contactListToPick,
          fromTitle: fromTitle(pickedContactIds.length),
          toTitle: t(CREATE_CHAT_ROOM_FORM_I18N.toTitle),
          rule: { name: 'required' }
        },
        avatarFile: {
          inputType: 'file',
          design: 'avatar',
          avatarStubIcon: 'image-stub',
          avatarShape: 'square-shape',
          avatarBorderless: true,
          hide: !(pickedContactIds.length > 1),
          label: t(CREATE_CHAT_ROOM_FORM_I18N.avatarLabel)
        },
        chatName: {
          inputType: 'text',
          placeholder: t(CREATE_CHAT_ROOM_FORM_I18N.chatNamePlaceholder),
          rule: { name: 'required' },
          hide: !(pickedContactIds.length > 1),
          label: t(CREATE_CHAT_ROOM_FORM_I18N.chatNameLabel)
        }
      }}
      disabledActionBtn={isPrivateChatAlreadyExists}
      submitBtnText={t(CREATE_CHAT_ROOM_FORM_I18N.submit)}
      actionProcessing={isLoading}
    >
      {isPrivateChatAlreadyExists && (
        <div className="create-chat-room-form__warning">
          <AppText size="small" color="warn-color">
            {t(CREATE_CHAT_ROOM_FORM_I18N.privateChatExists)}
          </AppText>
        </div>
      )}
    </AppForm>
  )
}
