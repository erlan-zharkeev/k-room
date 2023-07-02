import { UIIcon } from 'src/components/UI'
import { InformerProps } from './@types'
import { IconName } from 'src/components/UI/UIIcon/@types/IconName'

const Informer = ({ type, text }: InformerProps) => {
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

export default Informer
