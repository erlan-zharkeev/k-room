export interface IAppSelectOption {
  label: string
  value: string
}

export interface IAppSelectProps {
  options: IAppSelectOption[]
  value: string
  onChange: (value: string) => void
  loading: boolean
  disabled: boolean
}
