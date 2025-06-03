import { AppScrollContainerProps } from './types'

export const AppScrollContainer = ({
  height = '300px',
  children,
  additionalClassName,
  id,
  overflowY = 'auto',
  overflowX = 'auto'
}: AppScrollContainerProps) => {
  const style: React.CSSProperties = {
    maxHeight: height,
    overflowX,
    overflowY
  }

  return (
    <div
      id={id ?? String(Date.now())}
      className={`app-scroll-container${additionalClassName ? ` ${additionalClassName}` : ''}`}
      style={style}
    >
      {children}
    </div>
  )
}
