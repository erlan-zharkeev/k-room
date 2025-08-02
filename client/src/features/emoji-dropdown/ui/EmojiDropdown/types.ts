import { ReactElement } from 'react'

export interface IEmojiDropdownProps {
  setEmoji?: (value: string) => void
}

export interface IEmojiItems {
  key: string
  label?: ReactElement
  glyph: string
}
