interface ConsoleColorElement {
  bg: string,
  text: string
}

interface ConsoleTypes {
  [key: string]: ConsoleColorElement
}

type ConsoleType = 'error' | 'success' | 'warn'

const consoleColorMap = {
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
} as ConsoleTypes

export const $clg = (type: ConsoleType, message: string) => {
  console.log(`%c ${message} `, `background: ${consoleColorMap[type].bg}; color: ${consoleColorMap[type].text}`)
}

export default $clg