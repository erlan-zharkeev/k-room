import { ROOM_CALL_MEDIA_KIND } from 'global-shared'
import { computed } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

import { ROOM_CALL_ACTIVITY_KIND } from '../config/constants'
import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { CallActivityPanelItemProps } from '../config/types'

export const useCallActivityPanelItem = (props: CallActivityPanelItemProps) => {
  const avatarImageSrc = useLiveMediaUrl(() => props.item.avatarId)
  const audioButtonText = computed(() =>
    props.item.isPrivateRoom ? ROOM_CALL_SESSION_I18N.answerAudioRoomCall : ROOM_CALL_SESSION_I18N.joinAudioRoomCall
  )
  const videoButtonText = computed(() =>
    props.item.isPrivateRoom ? ROOM_CALL_SESSION_I18N.answerVideoRoomCall : ROOM_CALL_SESSION_I18N.joinVideoRoomCall
  )
  const showJoinControls = computed(() =>
    props.compact ? props.item.kind === ROOM_CALL_ACTIVITY_KIND.INCOMING : props.item.canJoin
  )
  const isAudioJoinLoading = computed(() => props.loadingMediaKind === ROOM_CALL_MEDIA_KIND.AUDIO)
  const isVideoJoinLoading = computed(() => props.loadingMediaKind === ROOM_CALL_MEDIA_KIND.VIDEO)
  const isLargePrivateActivity = computed(() => !props.compact && props.item.isPrivateRoom)

  return {
    avatarImageSrc,
    audioButtonText,
    isAudioJoinLoading,
    isLargePrivateActivity,
    isVideoJoinLoading,
    showJoinControls,
    videoButtonText
  }
}
