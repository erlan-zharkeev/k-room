<script setup lang="ts">
import { NmorphIcon, NmorphSelectButton, NmorphSelectButtonItem } from '@nmorph/nmorph-ui-kit'

import { useI18n } from 'src/shared/lib'

import {
  SELECT_LANGUAGE_DEFAULT_PROPS,
  SELECT_LANGUAGE_FLAG_ICON_MAP,
  SELECT_LANGUAGE_OPTIONS
} from '../config/constants'
import { SELECT_LANGUAGE_I18N } from '../config/i18n'

import type { SelectLanguageProps } from './types'
import { useSelectLanguageView } from './use-select-language-view.model'

const props = withDefaults(defineProps<SelectLanguageProps>(), SELECT_LANGUAGE_DEFAULT_PROPS)

const { t } = useI18n()
const { settings, changeLanguage, selectLanguageFlagSize } = useSelectLanguageView(props)
</script>

<template>
  <div class="select-language">
    <NmorphSelectButton
      :aria-label="t(SELECT_LANGUAGE_I18N.selectLanguage)"
      :thickness="props.compact ? 'basic' : 'thick'"
      :model-value="settings.localization.language"
      @update:model-value="changeLanguage"
      fill
    >
      <NmorphSelectButtonItem v-for="option in SELECT_LANGUAGE_OPTIONS" :key="option.value" :value="option.value">
        <div class="select-language__option">
          <NmorphIcon :width="selectLanguageFlagSize.WIDTH" :height="selectLanguageFlagSize.HEIGHT">
            <component :is="SELECT_LANGUAGE_FLAG_ICON_MAP[option.flag]" />
          </NmorphIcon>
        </div>
      </NmorphSelectButtonItem>
    </NmorphSelectButton>
  </div>
</template>

<style lang="scss" scoped>
.select-language__option {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
}
</style>
