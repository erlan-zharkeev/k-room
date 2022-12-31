import { Button, Progress } from 'antd'
import { useEffect, useState } from 'react'
import getRandomNumber from 'src/utils/getRandomNumber'
import { StubLoadingProps } from './@types/StubLoadingProps'

const StubLoading = ({ isLoading, reconnect }: StubLoadingProps) => {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (percent >= 100) return
      setPercent((percent) => {
        const newPercentValue = isLoading ? percent + getRandomNumber(5, 10) : 100
        return newPercentValue
      })
      return () => {
        clearTimeout(timer)
      }
    }, getRandomNumber(100, 300))
  }, [percent])

  const update = () => {
    setPercent(0)
    reconnect()
  }

  return isLoading ? (
    <div className="stub-loading">
      {percent >= 100 ? (
        <div className="stub-loading__update-block">
          <span>Connection failed</span>
          <Button onClick={update}>Update</Button>
        </div>
      ) : (
        <Progress className="stub-loading__progress" percent={percent} status="normal" />
      )}
    </div>
  ) : (
    <></>
  )
}

export default StubLoading
