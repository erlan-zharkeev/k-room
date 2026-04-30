import { useTimeoutFn } from '@vueuse/core'
import type { Virtualizer } from '@tanstack/vue-virtual'
import { nextTick, onBeforeUnmount, type ComputedRef, type Ref } from 'vue'

import { useSettings } from 'src/entities/setting'
import type { DbMessageType, IMessageListScrollState } from 'src/shared/config'

import { MESSAGE_SCROLL_SAVE_DEBOUNCE_MS } from '../config/constants'

export const useMessageScrollState = (
  messages: ComputedRef<DbMessageType[]>,
  scrollElement: Ref<HTMLElement | null>,
  virtualizer: Ref<Virtualizer<HTMLElement, HTMLElement>>
) => {
  const { settings, setByPath } = useSettings()
  let roomIdToPersist = ''

  const getScrollState = (): IMessageListScrollState | null => {
    const element = scrollElement.value
    const [firstVirtualItem] = virtualizer.value.getVirtualItems()
    const message = firstVirtualItem ? messages.value[firstVirtualItem.index] : undefined

    if (!element || !message) return null

    return {
      firstVisibleItemId: message.id,
      offsetFromItemStart: Math.max(element.scrollTop - firstVirtualItem.start, 0)
    }
  }

  const persistScrollState = async (roomId: string) => {
    const state = getScrollState()

    if (!state) return

    await setByPath(`messageScrollByRoom.${roomId}`, state)
  }

  const { start: startScrollSaveTimeout, stop: stopScrollSaveTimeout } = useTimeoutFn(
    () => void persistScrollState(roomIdToPersist),
    MESSAGE_SCROLL_SAVE_DEBOUNCE_MS,
    { immediate: false }
  )

  const schedulePersistScrollState = (roomId: string) => {
    roomIdToPersist = roomId
    stopScrollSaveTimeout()
    startScrollSaveTimeout()
  }

  const restoreScrollState = async (roomId: string, state = settings.value.messageScrollByRoom[roomId]) => {
    if (!state) return false

    const index = messages.value.findIndex(({ id }) => id === state.firstVisibleItemId)

    if (index < 0) return false

    await nextTick()

    const [offset] = virtualizer.value.getOffsetForIndex(index, 'start') ?? []

    if (typeof offset !== 'number') {
      virtualizer.value.scrollToIndex(index, { align: 'start' })

      return true
    }

    virtualizer.value.scrollToOffset(Math.max(offset + (state.offsetFromItemStart ?? 0), 0))

    return true
  }

  onBeforeUnmount(stopScrollSaveTimeout)

  return {
    getScrollState,
    persistScrollState,
    schedulePersistScrollState,
    restoreScrollState
  }
}
