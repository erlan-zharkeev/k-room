import './style.scss'
import { useMemo } from 'react'

import { AsidePanel } from 'src/widgets/aside-panel'
import { Content } from 'src/widgets/content'

import { useCall } from 'src/entities/call'

export const WorkspaceLayout = () => {
  const { isMinified } = useCall()

  const rootClassName = useMemo(
    () => (isMinified ? 'workspace-layout workspace-layout--with-minified-call-window' : 'workspace-layout'),
    [isMinified]
  )

  return (
    <div className={rootClassName}>
      <AsidePanel />
      <Content />
    </div>
  )
}
