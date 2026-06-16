import { computed, ref } from 'vue'

import { useOnboardingGuide } from 'src/features/onboarding-guide'
import { useI18n } from 'src/shared/lib'

import { FAQ_ITEMS } from '../../config/constants/faq.constants'
import type { FaqItem, ResolvedFaqItem } from '../../config/types/faq.types'
import { resolveFaqText } from '../../lib/resolve-faq-text'

export const useFaq = () => {
  const { t } = useI18n()
  const { openGuide } = useOnboardingGuide()
  const searchQuery = ref('')
  const { appName, appVersion, supportEmail } = __CLIENT_ENV_DATA__

  const contactSupport = () => {
    window.location.href = `mailto:${supportEmail}`
  }

  const resolveFaqItem = (item: FaqItem): ResolvedFaqItem => ({
    id: item.id,
    question: resolveFaqText(t(item.question), appName),
    answer: resolveFaqText(t(item.answer), appName)
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
    searchQuery,
    supportEmail
  }
}
