import { useTimeoutFn } from '@vueuse/core'
import { getAppChatRoomPath } from 'global-shared'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useOnboardingGuide } from 'src/features/onboarding-guide'
import { useSocketAction } from 'src/shared/api'
import { useI18n, useScreen } from 'src/shared/lib'

import {
  FAQ_INITIAL_VISIBLE_ITEMS_COUNT,
  FAQ_ITEMS,
  FAQ_VISIBLE_ITEMS_CHUNK_DELAY_MS,
  FAQ_VISIBLE_ITEMS_CHUNK_SIZE
} from '../../config/constants/faq.constants'
import type { FaqItem, ResolvedFaqItem } from '../../config/types/faq.types'

export const useFaq = () => {
  const router = useRouter()
  const { t } = useI18n()
  const { isPortraitTabletOrLess } = useScreen()
  const { openGuide } = useOnboardingGuide()
  const { emitSocketAction } = useSocketAction()
  const searchQuery = ref('')
  const visibleItemCount = ref(FAQ_INITIAL_VISIBLE_ITEMS_COUNT)
  const { appName, appVersion } = __CLIENT_ENV_DATA__

  const contactSupport = async () => {
    const response = await emitSocketAction('open-support-chat', undefined)

    if (!response.ok) {
      return
    }

    await router.push({
      path: getAppChatRoomPath(response.payload.roomId),
      query: isPortraitTabletOrLess.value ? { view: 'content' } : undefined
    })
  }

  const resolveFaqItem = (item: FaqItem): ResolvedFaqItem => ({
    id: item.id,
    question: t(item.question, { appName }),
    answer: t(item.answer, { appName })
  })

  const resolvedItems = computed(() => FAQ_ITEMS.map(resolveFaqItem))

  const filteredItems = computed(() => {
    const query = searchQuery.value.toLowerCase()

    if (!query) return resolvedItems.value

    return resolvedItems.value.filter((item) => {
      const question = item.question.toLowerCase()
      const answer = item.answer.toLowerCase()

      return question.includes(query) || answer.includes(query)
    })
  })

  const visibleItems = computed(() => filteredItems.value.slice(0, visibleItemCount.value))

  const renderNextVisibleItemsChunk = () => {
    visibleItemCount.value = Math.min(visibleItemCount.value + FAQ_VISIBLE_ITEMS_CHUNK_SIZE, filteredItems.value.length)

    if (visibleItemCount.value < filteredItems.value.length) {
      startVisibleItemsRenderTimer()
    }
  }

  const { start: startVisibleItemsRenderTimer, stop: stopVisibleItemsRenderTimer } = useTimeoutFn(
    renderNextVisibleItemsChunk,
    FAQ_VISIBLE_ITEMS_CHUNK_DELAY_MS,
    { immediate: false }
  )

  const resetVisibleItems = () => {
    stopVisibleItemsRenderTimer()

    if (searchQuery.value) {
      visibleItemCount.value = filteredItems.value.length
      return
    }

    visibleItemCount.value = Math.min(FAQ_INITIAL_VISIBLE_ITEMS_COUNT, filteredItems.value.length)

    if (visibleItemCount.value < filteredItems.value.length) {
      startVisibleItemsRenderTimer()
    }
  }

  watch(filteredItems, resetVisibleItems, { immediate: true })

  return {
    appVersion,
    contactSupport,
    filteredItems,
    openGuide,
    searchQuery,
    visibleItems
  }
}
