import { Badge } from 'antd'

import { AppButton } from 'src/shared/ui'

export const CallsButton = () => {
  // TODO: replace with real data
  const unAnsweredCalls = 0

  return (
    <Badge color="var(--accent)" count={unAnsweredCalls} size="small" offset={['-8px', '5px']}>
      <AppButton prefixIconName="call" borderless />
    </Badge>
  )
}
