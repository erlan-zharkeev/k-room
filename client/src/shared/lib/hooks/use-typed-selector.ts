import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { RootStateType } from 'src/app/store'

export const useTypedSelector: TypedUseSelectorHook<RootStateType> = useSelector
