import { createContext } from 'react'

import type { ContextRef } from '../types'

export const RefsContext = createContext<Record<string, ContextRef>>({})
export const AdditionalServiceContext = createContext<Record<string, ContextRef>>({})
