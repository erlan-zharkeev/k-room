import type { Contact } from 'global-shared'

import { useMedia } from 'src/entities/media-file'
import { useAppSound, useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { isClientPushEnabled, showClientPushWithImage, useAppToast, useI18n } from 'src/shared/lib'

import { CONTACT_INVITATION_NOTIFICATION_I18N } from '../config/i18n'

export const useContactInvitationNotification = () => {
  const { get: getMedia } = useMedia()
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const { playAppSound } = useAppSound()
  const { t } = useI18n()
  const toast = useAppToast()

  const canNotifyInvite = () => settings.value.notifications.enabled

  const showInviteToast = (contact: Contact) => {
    const { general, invites } = settings.value.notifications

    if (!canNotifyInvite()) return
    if (!general.toast) return
    if (!invites.toast) return

    toast.add({
      title: t(CONTACT_INVITATION_NOTIFICATION_I18N.inviteReceivedTitle),
      content: t(CONTACT_INVITATION_NOTIFICATION_I18N.inviteReceivedContent, { nickname: contact.nickname })
    })
  }

  const showInvitePush = async (contact: Contact) => {
    const { general, invites } = settings.value.notifications

    if (!canNotifyInvite()) return
    if (!isClientPushEnabled(general, invites)) return

    await showClientPushWithImage(
      t(CONTACT_INVITATION_NOTIFICATION_I18N.inviteReceivedTitle),
      {
        body: t(CONTACT_INVITATION_NOTIFICATION_I18N.inviteReceivedContent, { nickname: contact.nickname }),
        tag: `invite:${contact.id}`
      },
      contact.avatarId,
      getMedia
    )
  }

  const playInviteSound = async () => {
    const { general, invites } = settings.value.notifications

    if (!hasInteracted.value) return
    if (!canNotifyInvite()) return
    if (!general.sound) return
    if (!invites.sound) return

    try {
      await playAppSound('incoming-message')
    } catch (error) {
      void error
    }
  }

  const notifyInviteReceived = (contact: Contact) => {
    showInviteToast(contact)
    void showInvitePush(contact)
    void playInviteSound()
  }

  return {
    notifyInviteReceived
  }
}
