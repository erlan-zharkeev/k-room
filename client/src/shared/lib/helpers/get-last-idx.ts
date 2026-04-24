export const getLastIdx = <T, U extends keyof T>(arr: T[], key: U): number =>
  Number(arr.length > 0 ? arr.reduce((prev: T, current: T) => (prev[key] > current[key] ? prev : current))[key] : -1)
