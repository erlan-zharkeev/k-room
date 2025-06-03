import React from 'react'

import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'

export const AppDropdown = ({
  items,
  children,
  additionalClassName
}: {
  items: MenuProps['items']
  children: React.ReactNode
  additionalClassName?: string
}) => {
  return (
    <div className="app-dropdown">
      <Dropdown menu={{ items }} trigger={['click']} overlayClassName={additionalClassName}>
        {children}
      </Dropdown>
    </div>
  )
}
