import './style.scss'

import { SliceContact } from 'src/entities/contact'

import { AppDotsAnimatedText, AppLink, AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { useContactInvitationControls } from '../../hooks'

export const ContactInvitationControlBtns = ({ contactData }: { contactData: SliceContact }) => {
  const className = createClassNameWithModifiers({
    rootClass: 'contact-invitation-control-btns',
    modifiers: [contactData.interaction]
  })

  const { loaders, updateInteractionType } = useContactInvitationControls()

  return (
    <div className={className}>
      {loaders[contactData.id] ? (
        <div className="contact-invitation-control-btns__loader">
          <AppDotsAnimatedText text="Updating status" textSize="small" />
        </div>
      ) : (
        <>
          {contactData.interaction === 'default' && (
            <AppLink onClick={() => updateInteractionType(contactData.id, 'invited')} text="Send invite" />
          )}
          {contactData.interaction === 'invited' && (
            <AppText tag="p" size="small" accent>
              Invited
            </AppText>
          )}
          {contactData.interaction === 'invite-received' && (
            <>
              <AppLink onClick={() => updateInteractionType(contactData.id, 'invite-accepted')} text="Accept" />
              <AppLink
                onClick={() => updateInteractionType(contactData.id, 'default')}
                text="Decline"
                color="error-color"
              />
              <AppLink
                onClick={() => updateInteractionType(contactData.id, 'invite-hidden')}
                text="Hide"
                color="text-color"
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
