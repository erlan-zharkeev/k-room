const getNextReqInterval = (timestamp: number) => (timestamp - Number(Date.now())) / 1000
export default getNextReqInterval
