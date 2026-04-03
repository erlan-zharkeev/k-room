import { PropsWithChildren } from 'react'

export interface IAppClickOutsideProps extends PropsWithChildren {
  onClickOutside: () => void
  active?: boolean
  additionalClassName?: string
}
