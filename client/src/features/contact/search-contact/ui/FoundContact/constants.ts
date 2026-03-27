import { InteractionType } from 'common'

import type { AppIconNameType, ColorModifierType } from 'src/shared/ui'

export const NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP: Record<
  Exclude<InteractionType, 'default' | 'invite-hidden'>,
  { name: AppIconNameType; color: ColorModifierType }
> = {
  invited: {
    name: 'loader',
    color: 'accent-color'
  },
  'invite-accepted': {
    name: 'success',
    color: 'success-color'
  },
  'invite-received': {
    name: 'loader',
    color: 'text-color'
  }
}
