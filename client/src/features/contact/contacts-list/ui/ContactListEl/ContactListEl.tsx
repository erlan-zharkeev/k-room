import { ContactInvitationControlBtns } from 'src/features/contact/contact-invitation-controls'
import { ContactMenu } from 'src/features/contact/contact-menu'
import { getContactDescription } from 'src/features/contact/lib'

import { useMedia } from 'src/entities/media'
import { ProfileInfo } from 'src/entities/profile-info'

import { DbContactType } from 'src/shared/config'

export const ContactListEl = ({ contactData }: { contactData: DbContactType }) => {
  const { getLiveMedia } = useMedia()

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
      {contactData.interactionType === 'invite-accepted' && <ContactMenu id={contactData.id} />}
    </ProfileInfo>
  )
}
