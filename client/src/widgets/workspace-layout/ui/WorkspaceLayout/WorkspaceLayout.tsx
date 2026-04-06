import './style.scss'

import { AsidePanel } from 'src/widgets/aside-panel'
import { Content } from 'src/widgets/content'

// import { useCall } from 'src/entities/call'

export const WorkspaceLayout = () => {
  // const { isMinified } = useCall()
  // const rootClassName = isMinified ? 'workspace-layout workspace-layout--with-minified-call-window' : 'workspace-layout'

  return (
    <div className="workspace-layout">
      <AsidePanel />
      <Content />
    </div>
  )
}
