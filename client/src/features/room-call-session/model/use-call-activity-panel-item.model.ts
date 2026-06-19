import { computed } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

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
  const showJoinControls = computed(() => (props.compact ? props.item.kind === 'incoming' : props.item.canJoin))
  const isAudioJoinLoading = computed(() => props.loadingMediaKind === 'audio')
  const isVideoJoinLoading = computed(() => props.loadingMediaKind === 'video')
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
