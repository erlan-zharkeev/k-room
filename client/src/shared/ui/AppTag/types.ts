export type AppTagSeverityType = 'success' | 'warn' | 'danger' | 'info' | 'secondary'

export interface IAppTagProps {
  value?: string
  severity?: AppTagSeverityType
}
