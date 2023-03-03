export default interface UISwitchProps {
  initValue: boolean
  onText?: string
  offText?: string
  id: string
  onChange?: (value: boolean, id: string) => void
}
