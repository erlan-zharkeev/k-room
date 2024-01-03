import { useRef, useState } from 'react'

export const useCounter = (
  initValue: number,
  decremental: boolean = true
): [number, React.Dispatch<React.SetStateAction<number>>, () => void, () => void] => {
  const [value, setValue] = useState(initValue)

  const timerIdRef = useRef<number | NodeJS.Timeout>()

  const counter = () => {
    setValue((seconds) => {
      if (seconds <= 0) stopTimer()
      return decremental ? seconds - 1 : seconds + 1
    })
  }

  const startTimer = () => {
    if (timerIdRef.current) clearTimeout(timerIdRef.current)
    timerIdRef.current = setInterval(counter, 1000)
  }

  const stopTimer = () => {
    setValue(initValue)
    return clearTimeout(timerIdRef.current)
  }

  return [value, setValue, startTimer, stopTimer]
}
