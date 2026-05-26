import { computed } from 'vue'

import { createClassNameWithModifiers } from 'src/shared/lib'

import type { AppHeaderProps } from './types'

export const useAppHeader = (props: AppHeaderProps) => {
  const color = computed(() => props.color ?? (props.accent ? 'accent' : undefined))
  const className = computed(() =>
    createClassNameWithModifiers({
      rootClass: 'app-header',
      modifiers: [
        color.value,
        props.alignment,
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
