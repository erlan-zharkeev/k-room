import { EMOJI_PICKER_QUICK_LIST_LIMIT } from './constants'

export const buildNextEmojiPickerQuickList = (quickList: string[], emoji: string) => {
  const nextQuickList = [emoji, ...quickList.filter((item) => item !== emoji)]

  return nextQuickList.slice(0, EMOJI_PICKER_QUICK_LIST_LIMIT)
}
