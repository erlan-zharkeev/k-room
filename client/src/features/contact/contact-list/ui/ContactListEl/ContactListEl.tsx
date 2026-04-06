import {
  CONTACT_LIST_RERENDER_INTERVAL,
  ContactInvitationControlBtns,
  ContactMenu,
  getContactDescription
} from 'src/features/contact'
import { IContactListElProps } from 'src/features/contact'

import { useMedia } from 'src/entities/media'
import { ProfileInfo } from 'src/entities/profile-info'

import { useIntervalRerender } from 'src/shared/lib'
import { useI18n } from 'src/shared/settings'

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
