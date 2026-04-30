<script setup lang="ts">
import { SelectButton } from 'primevue'
import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'
import { AppHeader } from 'src/shared/ui'

import { LANGUAGE_SELECT_DEFAULT_PROPS, LANGUAGE_SELECT_OPTIONS } from '../config/constants'
import { LANGUAGE_SELECT_I18N } from '../config/i18n'
import { useLanguageSelect } from '../model/use-language-select'

import { ILanguageSelectProps } from './types'

const props = withDefaults(defineProps<ILanguageSelectProps>(), LANGUAGE_SELECT_DEFAULT_PROPS)

const { t } = useI18n()
const { selectedLanguage } = useLanguageSelect()
const withText = computed(() => props.size === 'large')

const selectButtonPt = computed(() => ({
  root: {
    class: ['language-select__input', `language-select__input--${props.size}`],
    'aria-label': t(LANGUAGE_SELECT_I18N.selectLanguage)
  }
}))
</script>

<template>
  <div class="language-select">
    <SelectButton
      v-model="selectedLanguage"
      :data-key="'value'"
      fluid
      :option-label="'label'"
      :option-value="'value'"
      :options="LANGUAGE_SELECT_OPTIONS"
      :pt="selectButtonPt"
      :size="props.size"
    >
      <template #option="{ option }">
        <div class="language-select__option">
          <span class="language-select__flag">{{ option.flag }}</span>
          <AppHeader v-if="withText" tag="h5" :text="option.label" />
        </div>
      </template>
    </SelectButton>
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
