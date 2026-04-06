import { CLIENT_ENV } from 'src/shared/config'

export const ErrorFallback = () => (
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
      Something went wrong. Please reload the page.
    </p>
    <button
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
      Reload
    </button>
  </div>
)
