import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useScreen } from 'src/shared/lib'

import { getSettingsPath } from '../config/constants/content.constants'
import { getSettingsContentId } from '../lib/get-settings-content-id'

import { useSettingsContentWarnings } from './use-settings-content-warnings.model'

export const useSettingsNavigationPage = () => {
  const route = useRoute()
  const { isPortraitTabletOrLess } = useScreen()
  const { hasContentWarning } = useSettingsContentWarnings()
  const selectedSettingsId = computed(() => {
    const { settingsId } = route.params

    return getSettingsContentId(settingsId)
  })

  const buildItemRoute = (settingsId: string) => ({
    path: getSettingsPath(settingsId),
    query: isPortraitTabletOrLess.value ? { ...route.query, view: 'content' } : route.query
  })

  return {
    selectedSettingsId,
    hasContentWarning,
    buildItemRoute
  }
}
