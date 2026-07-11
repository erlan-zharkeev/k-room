import { useEventListener } from '@vueuse/core'
import { computed } from 'vue'

import { useSystem } from 'src/entities/system'

import { USER_INTERACTION_EVENTS } from './user-interaction.constants'

export const useUserInteractionProvider = () => {
  const { hasInteracted, setHasInteracted } = useSystem()
  const interactionTarget = computed(() => (hasInteracted.value ? null : window))

  const handleInteraction = () => {
    setHasInteracted(true)
  }

  USER_INTERACTION_EVENTS.forEach((eventName) => {
    useEventListener(interactionTarget, eventName, handleInteraction)
  })
}
