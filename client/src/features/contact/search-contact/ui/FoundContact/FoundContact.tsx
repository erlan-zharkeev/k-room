import './style.scss'

import { MEDIA_ENDPOINTS } from 'common'

import { IFoundContactProps, AddContactBtn } from 'src/features/contact'
import { NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP } from 'src/features/contact'

import { ProfileInfo } from 'src/entities/profile-info'

import { AppIcon } from 'src/shared/ui'

export const FoundContact = ({ id, username, interactionType }: IFoundContactProps) => {
  if (interactionType === 'invite-hidden') return null

  return (
    <div className="search-contact__list-element" key={id}>
      <ProfileInfo avatar={`api${MEDIA_ENDPOINTS.getMediaFile}/avatar.${id}`} title={username} showBadge={false} />
      {interactionType === 'default' ? (
        <AddContactBtn id={id} />
      ) : (
        <div className="search-contact__list-element-interaction-icon">
          <AppIcon {...NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP[interactionType]} />
        </div>
      )}
    </div>
  )
}
