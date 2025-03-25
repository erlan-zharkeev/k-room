import './style.scss'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'
import { InfoMessages } from 'src/features/info-messages/ui/InfoMessages/InfoMessages'

export const InfoList = () => {
  return (
    <div className="info-list">
      <WidgetWrapper placement="main">
        <div className="info-list__header header-text header-text--md header-text--secondary">Info messages</div>
        <InfoMessages />
      </WidgetWrapper>
    </div>
  )
}
