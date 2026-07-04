import { defineI18n } from 'src/shared/lib'

export const CONTACT_INVITATION_NOTIFICATION_I18N = defineI18n('contactInvitationNotification', {
  inviteReceivedTitle: {
    en: 'Invite received',
    ru: 'Приглашение',
    zh: '收到邀请'
  },
  inviteReceivedContent: {
    en: '{nickname} sent you a contact invite',
    ru: '{nickname} отправил(а) приглашение в контакты',
    zh: '{nickname} 向你发送了联系人邀请'
  }
})
