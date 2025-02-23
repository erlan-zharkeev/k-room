import { Badge } from 'antd'
import { Button } from 'src/shared/ui'

export const CallsButton = () => {
  const unAnsweredCalls = 0

  return (
    <Badge color="var(--accent)" count={unAnsweredCalls} size="small" offset={[-15, 10]}>
      <Button type="radio" value="calls" iconName="calls" />
    </Badge>
  )
}
