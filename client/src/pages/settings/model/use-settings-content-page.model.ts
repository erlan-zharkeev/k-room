import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { SETTINGS_CONTENT_COMPONENTS } from '../config/constants/content.constants'
import { getSettingsContentId } from '../lib/get-settings-content-id'

export const useSettingsContentPage = () => {
  const route = useRoute()
  const selectedSettingsId = computed(() => {
    const { settingsId } = route.params

    return getSettingsContentId(settingsId)
  })
  const selectedSettingsComponent = computed(() => SETTINGS_CONTENT_COMPONENTS[selectedSettingsId.value])

  return {
    selectedSettingsComponent,
    selectedSettingsId
  }
}
