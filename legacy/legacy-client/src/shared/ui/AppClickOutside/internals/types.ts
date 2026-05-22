import { PropsWithChildren } from 'react'

export interface AppClickOutsideProps extends PropsWithChildren {
  onClickOutside: () => void
  active?: boolean
  additionalClassName?: string
}
