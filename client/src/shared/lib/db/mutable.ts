import cloneDeep from 'lodash/cloneDeep'

import type { Mutable } from './types'

export const cloneMutable = <T>(value: T): Mutable<T> => cloneDeep(value) as Mutable<T>
