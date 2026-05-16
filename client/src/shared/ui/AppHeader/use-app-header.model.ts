import { computed } from 'vue'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { APP_HEADER_COLOR_MODIFIERS } from './constants'
import type { IAppHeaderProps } from './types'

export const useAppHeader = (props: IAppHeaderProps) => {
  const color = computed(() => props.color ?? (props.accent ? 'accent' : undefined))
  const className = computed(() =>
    createClassNameWithModifiers({
      rootClass: 'app-header',
      modifiers: [
        color.value && APP_HEADER_COLOR_MODIFIERS[color.value],
        props.bold && 'bold',
        props.truncate && 'truncate',
        props.selectable === false && 'not-selectable'
      ]
    })
  )

  return {
    className
  }
}
