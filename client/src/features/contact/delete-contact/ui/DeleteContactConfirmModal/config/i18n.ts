import type { LocalizedTextMapType } from 'common'

export const DELETE_CONTACT_I18N = {
  modalTitle: {
    en: 'Delete contact',
    ru: 'Удалить контакт'
  },
  confirmText: {
    en: 'Are you sure you want to delete this contact?',
    ru: 'Вы уверены, что хотите удалить этот контакт?'
  },
  cancel: {
    en: 'Cancel',
    ru: 'Отмена'
  },
  confirm: {
    en: 'Delete',
    ru: 'Удалить'
  }
} as const satisfies LocalizedTextMapType
