import { useState } from 'react'

export const UseCounter = (initValue: number): any => {
  const [value, setValue] = useState(initValue)

  let timerId: string | number | NodeJS.Timeout = -1

  const counter = () => {
    setValue((seconds) => {
      if (seconds <= 0) stopTimer()
      return seconds - 1
    })
  }

  const startTimer = () => {
    if (timerId) clearTimeout(timerId)
    timerId = setInterval(counter, 1000)
  }

  const stopTimer = () => {
    setValue(0)
    return clearTimeout(timerId)
  }

  return [value, setValue, startTimer, stopTimer]
}

export default UseCounter
