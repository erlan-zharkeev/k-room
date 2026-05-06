import { computed, ref } from 'vue'

import { useI18n } from 'src/shared/lib'

import { FAQ_ITEMS } from '../../config/constants/faq.constants'

export const useFaq = () => {
  const { t } = useI18n()
  const searchQuery = ref('')

  const filteredItems = computed(() => {
    const query = searchQuery.value.toLowerCase()

    if (!query) return FAQ_ITEMS

    return FAQ_ITEMS.filter((item) => {
      const question = t(item.question).toLowerCase()
      const answer = t(item.answer).toLowerCase()

      return question.includes(query) || answer.includes(query)
    })
  })

  return {
    searchQuery,
    filteredItems
  }
}
