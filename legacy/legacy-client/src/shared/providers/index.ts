import { createContext } from 'react'

import { AdditionalServiceContext, RefsContext } from './types'

export const RefsContext = createContext<RefsContext>({} as RefsContext)
export const AdditionalServiceContext = createContext<AdditionalServiceContext>({} as AdditionalServiceContext)
export type { RefsContext, CallService, AdditionalServiceContext } from './types'
