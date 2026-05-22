import { AppLanguage } from 'common'

import { CLIENT_ENV } from 'src/shared/config'
import { getBrowserLanguage, normalizeAppLanguage } from 'src/shared/preferences'

import { ERROR_FALLBACK_I18N } from '../i18n'

const getPreferredLanguage = (): AppLanguage => {
  const documentLanguage = typeof document === 'undefined' ? null : normalizeAppLanguage(document.documentElement.lang)

  return documentLanguage ?? getBrowserLanguage()
}

export const ErrorFallback = () => {
  const language = getPreferredLanguage()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px',
        backgroundColor: `var(--main-bg, ${CLIENT_ENV.themeBg})`
      }}
    >
      <p
        style={{
          color: `var(--text, ${CLIENT_ENV.themeText})`,
          fontFamily: 'Montserrat, Helvetica, sans-serif',
          margin: 0
        }}
      >
        {ERROR_FALLBACK_I18N.message[language]}
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: '8px 20px',
          border: `1px solid var(--accent, ${CLIENT_ENV.themeAccent})`,
          borderRadius: '4px',
          background: 'transparent',
          color: `var(--accent, ${CLIENT_ENV.themeAccent})`,
          fontFamily: 'Montserrat, Helvetica, sans-serif',
          cursor: 'pointer'
        }}
      >
        {ERROR_FALLBACK_I18N.reload[language]}
      </button>
    </div>
  )
}
