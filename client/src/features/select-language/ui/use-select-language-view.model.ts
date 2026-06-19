import { computed } from 'vue'

import { SELECT_LANGUAGE_FLAG_SIZE } from '../config/constants'
import { useSelectLanguage } from '../model/use-select-language.model'

import type { SelectLanguageProps } from './types'

export const useSelectLanguageView = (props: SelectLanguageProps) => {
  const { settings, changeLanguage } = useSelectLanguage()
  const selectLanguageFlagSize = computed(() =>
    props.compact ? SELECT_LANGUAGE_FLAG_SIZE.COMPACT : SELECT_LANGUAGE_FLAG_SIZE.DEFAULT
  )

  return {
    settings,
    changeLanguage,
    selectLanguageFlagSize
  }
}
