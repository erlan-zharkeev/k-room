import { MIN_SUPPORTED_WIDTH, MIN_SUPPORTED_HEIGHT, useViewport } from 'src/entities/system'

import { AppText } from 'src/shared/ui'

import './style.scss'

export const UnsupportedResolutionStub = () => {
  const { lessThenSupported } = useViewport()
  if (!lessThenSupported) return null

  return (
    <div className="unsupported-resolution-stub">
      <AppText align="center" tag="p">
        Your screen resolution is too small to display this content.
      </AppText>
      <AppText align="center" tag="p">
        Please use at least {MIN_SUPPORTED_WIDTH}px width × {MIN_SUPPORTED_HEIGHT}px height.
      </AppText>
    </div>
  )
}
