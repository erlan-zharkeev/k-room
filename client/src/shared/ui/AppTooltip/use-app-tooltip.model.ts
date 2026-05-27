import { computed } from 'vue'

import { useTouchInput } from 'src/shared/lib'

import type { AppTooltipProps } from './types'

export const useAppTooltip = (props: AppTooltipProps) => {
  const { isTouchInput } = useTouchInput()
  const showTooltip = computed(() => Boolean(props.text) && !props.disabled && !isTouchInput.value)

  return {
    showTooltip
  }
}
