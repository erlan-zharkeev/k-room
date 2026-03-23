import './style.scss'

import { CONTENT_COMPONENT_MAP } from 'src/widgets/content/config'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { useSettings } from 'src/entities/settings'

export const Content = () => {
  const { selectedContentTab } = useSettings()

  return <WidgetWrapper name="content">{CONTENT_COMPONENT_MAP[selectedContentTab]}</WidgetWrapper>
}
