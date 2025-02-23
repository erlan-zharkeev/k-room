interface ConsoleColorElement {
  bg: string
  text: string
}

type ConsoleType = 'error' | 'success' | 'warn'

const consoleColorMap: Record<string, ConsoleColorElement> = {
  error: {
    bg: '#000000',
    text: 'red'
  },
  success: {
    bg: '#000000',
    text: 'green'
  },
  warn: {
    bg: '#000000',
    text: 'orange'
  }
}

export const clg = (type: ConsoleType, message: string) => {
  console.log(`%c ${message} `, `background: ${consoleColorMap[type].bg}; color: ${consoleColorMap[type].text}`)
}
