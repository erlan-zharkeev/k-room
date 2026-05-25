import { normalizeTimestamp } from 'global-shared'
import { computed } from 'vue'

import { useLocalizedDateTime } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'

import { USER_ACTIVITY_LAST_SEEN_STATUS_COLOR, USER_ACTIVITY_ONLINE_STATUS_COLOR } from '../config/constants'
import { USER_ACTIVITY_STATUS_I18N } from '../config/i18n'
import type { UserActivityStatusProps } from '../config/types'

export const useUserActivityStatus = (props: UserActivityStatusProps) => {
  const { formatRelativeTime } = useLocalizedDateTime()
  const { t } = useI18n()
  const text = computed(() => {
    if (props.online) return t(USER_ACTIVITY_STATUS_I18N.online)

    const normalizedLastSeen = normalizeTimestamp(props.lastSeen)

    if (!normalizedLastSeen) return t(USER_ACTIVITY_STATUS_I18N.lastSeenRecently)

    return `${t(USER_ACTIVITY_STATUS_I18N.lastSeen)} ${formatRelativeTime(normalizedLastSeen)}`
  })
  const color = computed(() =>
    props.online ? USER_ACTIVITY_ONLINE_STATUS_COLOR : USER_ACTIVITY_LAST_SEEN_STATUS_COLOR
  )

  return {
    color,
    text
  }
}
