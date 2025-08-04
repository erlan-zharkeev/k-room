import { createContext } from 'react'

import { ContextRefType } from '../config'

export const RefsContext = createContext<Record<string, ContextRefType>>({})
export const AdditionalServiceContext = createContext<Record<string, ContextRefType>>({})
