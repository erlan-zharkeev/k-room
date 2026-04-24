import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { RootStateType } from '../internals/types'

export const useTypedSelector: TypedUseSelectorHook<RootStateType> = useSelector
