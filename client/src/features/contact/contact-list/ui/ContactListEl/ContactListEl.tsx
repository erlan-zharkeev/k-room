import { ContactInvitationControlBtns, ContactMenu } from 'src/features/contact'
import { lastSeen } from 'src/features/contact/~shared/lib'

import { useMedia } from 'src/entities/media'
import { ProfileInfo } from 'src/entities/profile-info'
import { useI18n } from 'src/entities/system'

import { DbContactType } from 'src/shared/config'
import { useIntervalRerender } from 'src/shared/lib'

import { CONTACT_LIST_RERENDER_INTERVAL } from '../../config'

export const ContactListEl = ({ contactData }: { contactData: DbContactType }) => {
  const { getLiveMedia } = useMedia()
  const { language } = useI18n()
  useIntervalRerender(CONTACT_LIST_RERENDER_INTERVAL)

  const avatar = getLiveMedia(`avatar.${contactData.id}`)
  const description =
    contactData.interactionType === 'invite-accepted'
      ? contactData.online
        ? language === 'ru'
          ? 'в сети'
          : 'online'
        : lastSeen(contactData.lastSeen, language)
      : ''

  return (
    <ProfileInfo
      avatar={avatar}
      title={contactData.username}
      showBadge={false}
      description={description}
      isDescriptionAccent={Boolean(contactData.online)}
      descriptionNode={
        contactData.interactionType !== 'invite-accepted' && <ContactInvitationControlBtns contactData={contactData} />
      }
    >
      {(contactData.interactionType === 'invite-accepted' || contactData.interactionType === 'default') && (
        <ContactMenu id={contactData.id} interactionType={contactData.interactionType} />
      )}
    </ProfileInfo>
  )
}
