export interface IAppSelectOption {
  label: string
  value: string
}

export interface IAppSelectProps {
  options: IAppSelectOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  loading?: boolean
  disabled: boolean
}
