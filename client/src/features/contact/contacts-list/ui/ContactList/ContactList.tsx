import './style.scss'

import { ContactInvitationControlBtns, ContactMenu, useContactList, getContactDescription } from 'src/features/contact'

import { ProfileInfo } from 'src/entities/profile-info'

import { AppText, AppScrollContainer } from 'src/shared/ui'

export const ContactList = () => {
  const { contactList } = useContactList()

  return (
    <div className="contact-list">
      {contactList.length <= 0 && <AppText>There are no contacts yet</AppText>}
      <AppScrollContainer height="100%" additionalClassName="contact-list__scroll-controller">
        {contactList.map((contactData) => (
          <div className="contact-list__list-item" key={contactData.id}>
            <ProfileInfo
              avatarPath={contactData.avatarPath}
              title={contactData.username}
              showBadge={false}
              description={getContactDescription(contactData)}
              isDescriptionAccent={contactData.online}
              descriptionNode={
                contactData.interaction !== 'invite-accepted' && (
                  <ContactInvitationControlBtns contactData={contactData} />
                )
              }
            >
              {contactData.interaction === 'invite-accepted' && <ContactMenu id={contactData.id} />}
            </ProfileInfo>
          </div>
        ))}
      </AppScrollContainer>
    </div>
  )
}
