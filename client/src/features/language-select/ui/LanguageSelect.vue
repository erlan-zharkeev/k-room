<script setup lang="ts">
import { NmorphSelectButton, NmorphSelectButtonItem } from '@nmorph/nmorph-ui-kit'

import { useI18n, useScreen } from 'src/shared/lib'
import { AppHeader } from 'src/shared/ui'

import { LANGUAGE_SELECT_DEFAULT_PROPS, LANGUAGE_SELECT_OPTIONS } from '../config/constants'
import { LANGUAGE_SELECT_I18N } from '../config/i18n'
import { useLanguageSelect } from '../model/use-language-select.model'

import type { ILanguageSelectProps } from './types'

const props = withDefaults(defineProps<ILanguageSelectProps>(), LANGUAGE_SELECT_DEFAULT_PROPS)

const { t } = useI18n()
const { settings, changeLanguage } = useLanguageSelect()
const { isPortraitTabletOnly } = useScreen()
</script>

<template>
  <div :class="['language-select', { 'language-select--compact': props.compact }]">
    <NmorphSelectButton
      :aria-label="t(LANGUAGE_SELECT_I18N.selectLanguage)"
      :class="['language-select__input', { 'language-select__input--compact': props.compact }]"
      :height="props.compact ? 'default' : 'thick'"
      :model-value="settings.localization.language"
      @update:model-value="changeLanguage"
      fill
    >
      <NmorphSelectButtonItem
        v-for="option in LANGUAGE_SELECT_OPTIONS"
        :key="option.value"
        :class="['language-select__item', { 'language-select__item--compact': props.compact }]"
        :value="option.value"
      >
        <div class="language-select__option">
          <span class="language-select__flag">{{ option.flag }}</span>
          <AppHeader v-if="!props.compact && isPortraitTabletOnly" tag="h5" :text="option.label" />
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

.language-select__flag {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  font-size: 20px;
  line-height: 1;
}
</style>
