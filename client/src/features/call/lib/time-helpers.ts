import moment from 'moment'

export const callCounter = (value: number) => moment.utc(value * 1000).format('HH:mm:ss')

export const getCallLength = (value: number) => moment.utc(value * 1000).format('mm:ss')

export const callDate = (value: number) => moment.utc(value).format('MMMM Do YYYY')

export const callTime = (value: number) => moment(value).format('H:mm:ss')
