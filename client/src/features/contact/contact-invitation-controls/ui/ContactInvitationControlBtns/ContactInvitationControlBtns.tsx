import './style.scss'

import { CONTACT_INVITATION_CONTROL_BTNS_I18N } from 'src/features/contact/contact-invitation-controls/ui/ContactInvitationControlBtns/config'

import { useI18n } from 'src/entities/system'

import type { DbContactType } from 'src/shared/config'
import { AppDotsAnimatedText, AppLink, AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { useContactInvitationControls } from '../../hooks'

export const ContactInvitationControlBtns = ({ contactData }: { contactData: DbContactType }) => {
  const { t } = useI18n()
  const className = createClassNameWithModifiers({
    rootClass: 'contact-invitation-control-btns',
    modifiers: [contactData.interactionType]
  })

  const { loaders, updateInteractionType } = useContactInvitationControls()

  return (
    <div className={className}>
      {loaders[contactData.id] ? (
        <div className="contact-invitation-control-btns__loader">
          <AppDotsAnimatedText text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.updatingStatus)} textSize="small" />
        </div>
      ) : (
        <>
          {contactData.interactionType === 'default' && (
            <>
              <AppLink prevent onClick={() => updateInteractionType(contactData.id, 'invited')} text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.sendInvite)} />
            </>
          )}
          {contactData.interactionType === 'invited' && (
            <AppText tag="p" size="small" color="accent-color">
              {t(CONTACT_INVITATION_CONTROL_BTNS_I18N.invited)}
            </AppText>
          )}
          {contactData.interactionType === 'invite-received' && (
            <>
              <AppLink prevent onClick={() => updateInteractionType(contactData.id, 'invite-accepted')} text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.accept)} />
              <AppLink
                prevent
                onClick={() => updateInteractionType(contactData.id, 'default')}
                text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.decline)}
                color="error-color"
              />
              <AppLink
                prevent
                onClick={() => updateInteractionType(contactData.id, 'invite-hidden')}
                text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.hide)}
                color="text-color"
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
