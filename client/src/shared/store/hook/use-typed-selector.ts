import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { RootStateType } from '../config'

export const useTypedSelector: TypedUseSelectorHook<RootStateType> = useSelector
