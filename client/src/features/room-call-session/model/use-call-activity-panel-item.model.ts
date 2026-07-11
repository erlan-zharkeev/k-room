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
  const actionButtonThickness = computed(() => (props.compact ? 'basic' : 'thick'))
  const actionIconSize = computed(() => (props.compact ? '16px' : '32px'))
  const joinActionColor = computed(() => (props.compact ? undefined : 'var(--nmorph-success-text-color)'))
  const leaveActionColor = computed(() => (props.compact ? undefined : 'var(--nmorph-error-text-color)'))

  return {
    actionButtonThickness,
    actionIconSize,
    avatarImageSrc,
    audioButtonText,
    isAudioJoinLoading,
    isLargePrivateActivity,
    isVideoJoinLoading,
    joinActionColor,
    leaveActionColor,
    showJoinControls,
    videoButtonText
  }
}
