import { type LocalizedTextType } from 'common-types'

export const OPEN_MODAL_EDIT_USER_DATA_BTN_TEXT = {
  link: {
    en: 'Edit user data',
    ru: 'Редактировать профиль'
  },
  modalTitle: {
    en: 'Edit user data',
    ru: 'Редактирование профиля'
  }
} as const satisfies Record<string, LocalizedTextType>
