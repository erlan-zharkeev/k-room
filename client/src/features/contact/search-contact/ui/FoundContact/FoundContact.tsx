import './style.scss'

import { MediaEndpointsEnum } from 'common'

import { AddContactBtn } from 'src/features/contact'
import type { IFoundContactProps } from 'src/features/contact/search-contact/ui/FoundContact/config'
import { NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP } from 'src/features/contact/search-contact/ui/FoundContact/constants'

import { ProfileInfo } from 'src/entities/profile-info'

import { AppIcon } from 'src/shared/ui'

export const FoundContact = ({ id, username, interactionType }: IFoundContactProps) => {
  if (interactionType === 'invite-hidden') return null

  return (
    <div className="search-contact__list-element" key={id}>
      <ProfileInfo avatar={`api${MediaEndpointsEnum.GetMediaFile}/avatar.${id}`} title={username} showBadge={false} />
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
