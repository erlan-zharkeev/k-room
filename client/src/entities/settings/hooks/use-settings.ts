import { useMemo } from 'react'

import { ContentTabType } from 'common-types'

import { useTypedSelector } from 'src/shared/lib'

const FULL_CONTENT_ELEMENTS: ContentTabType[] = ['info']

export const useSettings = () => {
  const {
    selectedContentTab,
    selectedChatRoomId,
    soundOn,
    theme,
    showWallpaper,
    showTooltips,
    showNotification,
    selectedAudioInputDeviceId,
    selectedVideoInputDeviceId,
    selectedAudioOutputDeviceId
  } = useTypedSelector((state) => state.persist.settings)

  const hideAsidePanel = useMemo(() => FULL_CONTENT_ELEMENTS.includes(selectedContentTab), [selectedContentTab])

  return {
    selectedContentTab,
    selectedChatRoomId,
    soundOn,
    theme,
    showWallpaper,
    showTooltips,
    showNotification,
    selectedAudioInputDeviceId,
    selectedVideoInputDeviceId,
    selectedAudioOutputDeviceId,
    showAsidePanel: !hideAsidePanel,
    isThemeDark: useMemo(() => theme === 'dark', [theme])
  }
}
