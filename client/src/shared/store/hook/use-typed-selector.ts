import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { RootStateType } from '../internals'

export const useTypedSelector: TypedUseSelectorHook<RootStateType> = useSelector
