import { computed, useSlots } from 'vue'

import type { CardProps } from '../config/types/card.types'

export const useSettingsCard = (props: CardProps) => {
  const slots = useSlots()
  const hasFooter = computed(() => Boolean(slots.footer || props.buttonLabel))

  return {
    hasFooter
  }
}
