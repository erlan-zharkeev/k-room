export interface IAppSelectOption {
  label: string
  value: string
}

export type IAppSelectProps<TMultiple extends boolean = false> = {
  options: IAppSelectOption[]
  multiple?: TMultiple
  loading?: boolean
  disabled?: boolean
} & (TMultiple extends true
  ? {
      value: string[]
      onChange: (value: string[]) => void
    }
  : {
      value: string
      onChange: (value: string) => void
    })
