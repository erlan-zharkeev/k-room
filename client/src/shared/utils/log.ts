const consoleColorMap: Record<
  string,
  {
    bg: string
    text: string
  }
> = {
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

export const log = (type: 'error' | 'success' | 'warn', message: string) => {
  console.log(`%c ${message} `, `background: ${consoleColorMap[type].bg}; color: ${consoleColorMap[type].text}`)
}
