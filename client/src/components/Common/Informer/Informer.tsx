import { IconName, UIIcon } from 'src/components'

export type InformerTypes = 'error' | 'warn' | 'success'

export interface InformerProps {
  type: InformerTypes
  text: string
}

export const Informer = ({ type, text }: InformerProps) => {
  const currentType = type as IconName
  return (
    <div className={`informer informer--${type}`}>
      <div className="informer__icon">
        <UIIcon name={currentType} />
      </div>
      <div className="informer__text paragraph-text paragraph-text--secondary">{text}</div>
    </div>
  )
}
