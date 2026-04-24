import cloneDeep from 'lodash/cloneDeep'

import type { MutableType } from '../types'

export const cloneMutable = <T>(value: T): MutableType<T> => cloneDeep(value) as MutableType<T>
