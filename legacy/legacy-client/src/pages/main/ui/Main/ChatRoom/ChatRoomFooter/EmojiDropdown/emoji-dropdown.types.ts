import { ReactElement } from 'react'

export interface EmojiDropdownProps {
  setEmoji?: (value: string) => void
}

export interface EmojiItems {
  key: string
  label?: ReactElement
  glyph: string
}
