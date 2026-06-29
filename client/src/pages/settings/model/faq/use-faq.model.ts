import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useOnboardingGuide } from 'src/features/onboarding-guide'
import { useSocketAction } from 'src/shared/api'
import { useI18n, useScreen } from 'src/shared/lib'

import { FAQ_ITEMS } from '../../config/constants/faq.constants'
import type { FaqItem, ResolvedFaqItem } from '../../config/types/faq.types'

export const useFaq = () => {
  const router = useRouter()
  const { t } = useI18n()
  const { isPortraitTabletOrLess } = useScreen()
  const { openGuide } = useOnboardingGuide()
  const { emitSocketAction } = useSocketAction()
  const searchQuery = ref('')
  const { appName, appVersion } = __CLIENT_ENV_DATA__

  const contactSupport = async () => {
    const response = await emitSocketAction('open-support-chat', undefined)

    if (!response.ok) {
      return
    }

    await router.push({
      path: `${APP_PAGE_ROUTES.chatRooms}/${response.payload.roomId}`,
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

  return {
    appVersion,
    contactSupport,
    filteredItems,
    openGuide,
    searchQuery
  }
}
