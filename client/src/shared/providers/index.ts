import { createContext } from 'react'

export const RefsContext = createContext<Record<string, React.MutableRefObject<any>>>({})
export const AdditionalServiceContext = createContext<Record<string, React.MutableRefObject<any>>>({})
