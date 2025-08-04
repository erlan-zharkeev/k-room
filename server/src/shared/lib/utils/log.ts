const clc = require('cli-color')

export const log = {
  info: (msg: string) => console.log(clc.cyan.bgWhite(msg)),
  success: (msg: string) => console.log(clc.green.bgWhite(msg)),
  error: (msg: string) => console.error(clc.red.bgWhite(msg)),
  warn: (msg: string) => console.warn(clc.yellow.bgWhite(msg))
}
