export interface AppSelectOption {
  label: string
  value: string
}

export type AppSelectProps<TMultiple extends boolean = false> = {
  options: AppSelectOption[]
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
