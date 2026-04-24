import React, { CSSProperties } from 'react'

import { MenuProps, Dropdown } from 'antd'

export const AppDropdown = ({
  items,
  children,
  additionalClassName,
  overlayStyle = {}
}: {
  items: MenuProps['items']
  children: React.ReactNode
  additionalClassName?: string
  overlayStyle?: CSSProperties
}) => {
  return (
    <div className="app-dropdown">
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        overlayClassName={additionalClassName}
        destroyPopupOnHide
        overlayStyle={overlayStyle}
      >
        {children}
      </Dropdown>
    </div>
  )
}
