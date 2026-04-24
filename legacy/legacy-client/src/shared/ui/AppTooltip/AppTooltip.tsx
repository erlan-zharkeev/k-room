import { Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'

import { useSettings } from 'src/shared/preferences'

export const AppTooltip = ({
  text,
  children,
  placement = 'top'
}: {
  text: string
  children: React.ReactNode
  placement?: TooltipPlacement
}) => {
  const { showTooltips } = useSettings()
  const title = text && showTooltips ? text : ''

  return (
    <Tooltip title={title} arrow={false} placement={placement}>
      <div className="app-tooltip">{children}</div>
    </Tooltip>
  )
}
