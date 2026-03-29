import './style.scss'

import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { useSettings } from 'src/entities/settings'

import { CONTENT_COMPONENT_MAP } from '../config'

export const Content = () => {
  const { selectedContentTab } = useSettings()

  return <WidgetWrapper name="content">{CONTENT_COMPONENT_MAP[selectedContentTab]}</WidgetWrapper>
}
