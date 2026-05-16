import { computed } from 'vue'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { APP_TEXT_COLOR_MODIFIERS, APP_TEXT_DEFAULT_PROPS } from './constants'
import type { IAppTextProps } from './types'

export const useAppText = (props: IAppTextProps) => {
  const className = computed(() =>
    createClassNameWithModifiers({
      rootClass: 'app-text',
      modifiers: [
        APP_TEXT_COLOR_MODIFIERS[props.color ?? APP_TEXT_DEFAULT_PROPS.color],
        props.alignment,
        props.bold && 'bold',
        props.truncate && 'truncate',
        props.noLineHeight && 'no-line-height',
        props.selectable === false && 'not-selectable'
      ]
    })
  )

  return {
    className
  }
}
