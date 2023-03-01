export default interface UISwitchProps {
  initValue: boolean
  onText?: string
  offText?: string
  id: string
  change?: (value: boolean, id: string) => void
}
