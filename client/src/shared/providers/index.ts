import { createContext } from 'react'

import { IAdditionalServiceContext, IRefsContext } from './types'

export const RefsContext = createContext<IRefsContext>({} as IRefsContext)
export const AdditionalServiceContext = createContext<IAdditionalServiceContext>({} as IAdditionalServiceContext)
export type * from './types'
