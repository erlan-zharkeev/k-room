import './style.scss'

import { ReactNode } from 'react'

// import { useCall } from 'src/entities/call'

export const WorkspaceLayout = ({ asidePanel, content }: { asidePanel?: ReactNode; content?: ReactNode }) => {
  // const { isMinified } = useCall()
  // const rootClassName = isMinified ? 'workspace-layout workspace-layout--with-minified-call-window' : 'workspace-layout'

  return (
    <div className="workspace-layout">
      {asidePanel}
      {content}
    </div>
  )
}
