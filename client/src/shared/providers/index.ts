import { createContext } from 'react'
import { ContextRef } from '../types'

export const RefsContext = createContext<Record<string, ContextRef>>({})
export const AdditionalServiceContext = createContext<Record<string, ContextRef>>({})
