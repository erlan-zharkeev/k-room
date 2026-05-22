import { onScopeDispose } from 'vue'

import { DB_QUOTA_I18N, subscribeDexieQuotaEvents, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

export const useDbQuotaToastProvider = () => {
  const { t } = useI18n()
  const toast = useAppToast()

  const unsubscribe = subscribeDexieQuotaEvents(({ type }) => {
    const isTrimmed = type === 'cache-trimmed'

    toast.add({
      isCritical: true,
      type: isTrimmed ? 'warning' : 'error',
      title: t(isTrimmed ? TOAST_I18N.warn : TOAST_I18N.error),
      content: t(isTrimmed ? DB_QUOTA_I18N.cacheTrimmed : DB_QUOTA_I18N.cacheTrimFailed)
    })
  })

  onScopeDispose(unsubscribe)
}
