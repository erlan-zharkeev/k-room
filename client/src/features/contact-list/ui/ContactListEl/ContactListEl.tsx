import { ContactInvitationControlBtns } from 'src/features/contact-invitation-controls'
import { CONTACT_LIST_RERENDER_INTERVAL } from 'src/features/contact-list'
import { IContactListElProps } from 'src/features/contact-list'
import { ContactMenu } from 'src/features/contact-menu'
import { getContactDescription } from 'src/features/contact-shared'

import { useMedia } from 'src/entities/media-file'
import { ProfileInfo } from 'src/entities/profile-info'

import { useIntervalRerender } from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'

export const ContactListEl = ({ contactData }: IContactListElProps) => {
  const { getLiveMediaUrl } = useMedia()
  const { language } = useI18n()
  useIntervalRerender(CONTACT_LIST_RERENDER_INTERVAL)

  const avatar = getLiveMediaUrl(`avatar.${contactData.id}`)
  const description = getContactDescription(contactData, language) ?? ''

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
