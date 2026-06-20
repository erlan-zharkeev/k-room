import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'

import { ROADMAP_ITEMS, ROADMAP_STATUS_I18N } from '../config/constants/roadmap.constants'
import type { ResolvedRoadmapItem, RoadmapItem } from '../config/types/roadmap.types'

export const useRoadmap = () => {
  const { t } = useI18n()

  const resolveRoadmapItem = (item: RoadmapItem): ResolvedRoadmapItem => ({
    id: item.id,
    statusText: t(ROADMAP_STATUS_I18N[item.status]),
    title: t(item.title),
    description: t(item.description)
  })

  const roadmapItems = computed(() => ROADMAP_ITEMS.map(resolveRoadmapItem))

  return {
    roadmapItems
  }
}
