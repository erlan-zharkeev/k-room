import { UIIcon } from 'src/components'
import { IconName } from 'src/components/ui/UIIcon/@types/IconName'
import { InformerProps } from './@types'

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
