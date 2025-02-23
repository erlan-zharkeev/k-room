import './style.scss'
import { IconName, Icon } from 'src/shared/ui'

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
        <Icon name={currentType} />
      </div>
      <div className="informer__text paragraph-text paragraph-text--secondary">{text}</div>
    </div>
  )
}
