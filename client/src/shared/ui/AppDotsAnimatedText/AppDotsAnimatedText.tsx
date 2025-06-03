import './style.scss'
import { useEffect, useState } from 'react'

import { useTimeout } from 'src/shared/lib'

import { AppText } from '../AppText/AppText'

import { DotsAnimatedTextProps } from './types'

export const AppDotsAnimatedText = ({ text, maxDots = 3, interval = 500, textSize }: DotsAnimatedTextProps) => {
  const [dots, setDots] = useState(0)
  const { startTimeout } = useTimeout()

  useEffect(() => {
    startTimeout(() => {
      setDots((prev) => (prev < maxDots ? prev + 1 : 0))
    }, interval)
  }, [dots])

  return (
    <AppText accent additionalClassName="app-dots-animated-text" size={textSize}>
      {text}
      <div className="app-dots-animated-text__dots">{'.'.repeat(dots)}</div>
    </AppText>
  )
}
