import './style.scss'

import { ReactNode } from 'react'

import { WidgetWrapper } from 'src/shared/ui'

export const Content = ({ children }: { children?: ReactNode }) => {
  return <WidgetWrapper name="content">{children}</WidgetWrapper>
}
