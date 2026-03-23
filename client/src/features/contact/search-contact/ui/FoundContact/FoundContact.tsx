import './style.scss'

import { IFrontendContact, MediaEndpointsEnum } from 'common-types'

import { AddContactBtn } from 'src/features/contact'

import { ProfileInfo } from 'src/entities/profile-info'

import { AppIcon } from 'src/shared/ui'

import { NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP } from './constants'

export const FoundContact = ({ id, username, interactionType }: IFrontendContact) => {
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
