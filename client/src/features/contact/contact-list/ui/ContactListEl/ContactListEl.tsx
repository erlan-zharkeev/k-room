import { ContactInvitationControlBtns } from 'src/features/contact/contact-invitation-controls'
import { ContactMenu } from 'src/features/contact/contact-menu'
import { getContactDescription } from 'src/features/contact/lib'

import { useMedia } from 'src/entities/media'
import { ProfileInfo } from 'src/entities/profile-info'

import { DbContactType } from 'src/shared/config'
import { useIntervalRerender } from 'src/shared/lib'

import { CONTACT_LIST_RERENDER_INTERVAL } from '../../config'

export const ContactListEl = ({ contactData }: { contactData: DbContactType }) => {
  const { getLiveMedia } = useMedia()
  useIntervalRerender(CONTACT_LIST_RERENDER_INTERVAL)

  const avatar = getLiveMedia(`avatar.${contactData.id}`)

  return (
    <ProfileInfo
      avatar={avatar}
      title={contactData.username}
      showBadge={false}
      description={getContactDescription(contactData)}
      isDescriptionAccent={true} /// TODO ONLINE
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
