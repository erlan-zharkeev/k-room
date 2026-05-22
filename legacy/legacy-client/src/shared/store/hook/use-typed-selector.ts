import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { RootState } from '../internals/types'

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
