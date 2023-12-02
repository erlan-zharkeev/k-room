import { TypedUseSelectorHook, useSelector } from 'react-redux'
import type { RootState } from 'src/store'

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
