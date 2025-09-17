import './style.scss'

import type { DbContactType } from 'src/shared/config'
import { AppDotsAnimatedText, AppLink, AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { useContactInvitationControls } from '../../hooks'

export const ContactInvitationControlBtns = ({ contactData }: { contactData: DbContactType }) => {
  const className = createClassNameWithModifiers({
    rootClass: 'contact-invitation-control-btns',
    modifiers: [contactData.interactionType]
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
          {contactData.interactionType === 'default' && (
            <AppLink onClick={() => updateInteractionType(contactData.id, 'invited')} text="Send invite" />
          )}
          {contactData.interactionType === 'invited' && (
            <AppText tag="p" size="small" color="accent-color">
              Invited
            </AppText>
          )}
          {contactData.interactionType === 'invite-received' && (
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
