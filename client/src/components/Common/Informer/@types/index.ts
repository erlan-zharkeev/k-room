export type InformerTypes = 'error' | 'warn' | 'success'

export interface InformerProps {
  type: InformerTypes
  text: string
}
