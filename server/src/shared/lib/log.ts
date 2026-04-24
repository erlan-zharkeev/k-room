import clc from 'cli-color'

export const log = {
  info: (message: string) => {
    console.log(clc.cyan.bgWhite(message))
  },
  success: (message: string) => {
    console.log(clc.green.bgWhite(message))
  },
  error: (message: string) => {
    console.error(clc.red.bgWhite(message))
  },
  warn: (message: string) => {
    console.warn(clc.bgYellowBright.bgWhite(message))
  }
}
