import './style.scss'
import { useEffect, useState } from 'react'

import { useTimeout } from 'src/shared/lib'

import { AppText } from '../AppText/AppText'

import type { IDotsAnimatedTextProps } from './config'

export const AppDotsAnimatedText = ({ text, maxDots = 3, interval = 500, textSize }: IDotsAnimatedTextProps) => {
  const [dots, setDots] = useState(0)
  const { startTimeout } = useTimeout()

  useEffect(() => {
    startTimeout(() => {
      setDots((prev) => (prev < maxDots ? prev + 1 : 0))
    }, interval)
  }, [dots])

  return (
    <AppText color="accent-color" additionalClassName="app-dots-animated-text" size={textSize}>
      {text}
      <div className="app-dots-animated-text__dots">{'.'.repeat(dots)}</div>
    </AppText>
  )
}
