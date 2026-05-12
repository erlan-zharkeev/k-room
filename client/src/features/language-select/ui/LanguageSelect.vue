<script setup lang="ts">
import { NmorphIcon, NmorphSelectButton, NmorphSelectButtonItem } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'

import {
  LANGUAGE_SELECT_DEFAULT_PROPS,
  LANGUAGE_SELECT_FLAG_ICON_MAP,
  LANGUAGE_SELECT_FLAG_SIZE,
  LANGUAGE_SELECT_OPTIONS
} from '../config/constants'
import { LANGUAGE_SELECT_I18N } from '../config/i18n'
import { useLanguageSelect } from '../model/use-language-select.model'

import type { ILanguageSelectProps } from './types'

const props = withDefaults(defineProps<ILanguageSelectProps>(), LANGUAGE_SELECT_DEFAULT_PROPS)

const { t } = useI18n()
const { settings, changeLanguage } = useLanguageSelect()
const languageSelectFlagSize = computed(() =>
  props.compact ? LANGUAGE_SELECT_FLAG_SIZE.COMPACT : LANGUAGE_SELECT_FLAG_SIZE.DEFAULT
)
</script>

<template>
  <div :class="['language-select', { 'language-select--compact': props.compact }]">
    <NmorphSelectButton
      :aria-label="t(LANGUAGE_SELECT_I18N.selectLanguage)"
      :class="['language-select__input', { 'language-select__input--compact': props.compact }]"
      :height="props.compact ? 'basic' : 'thick'"
      :model-value="settings.localization.language"
      @update:model-value="changeLanguage"
      fill
    >
      <NmorphSelectButtonItem v-for="option in LANGUAGE_SELECT_OPTIONS" :key="option.value" :value="option.value">
        <div class="language-select__option">
          <NmorphIcon
            class="language-select__flag"
            :width="languageSelectFlagSize.WIDTH"
            :height="languageSelectFlagSize.HEIGHT"
          >
            <component :is="LANGUAGE_SELECT_FLAG_ICON_MAP[option.flag]" />
          </NmorphIcon>
        </div>
      </NmorphSelectButtonItem>
    </NmorphSelectButton>
  </div>
</template>

<style lang="scss">
.language-select__option {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
}
</style>
