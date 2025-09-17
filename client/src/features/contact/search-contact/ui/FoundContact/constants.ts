import { InteractionType } from 'common-types'

import { AppIconName, ColorModifier } from 'src/shared/ui'

export const NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP: Record<
  Exclude<InteractionType, 'default' | 'invite-hidden'>,
  { name: AppIconName; color: ColorModifier }
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
