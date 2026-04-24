import './content-tab.scss'

import { ContentTabType } from 'src/shared/config'
import { createClassNameWithModifiers } from 'src/shared/lib'
import { useContentTabSelect, useSettings } from 'src/shared/preferences'

import { BUTTONS } from './constants.ts'

export const ContentTab = () => {
  const { selectedContentTab } = useSettings()
  const { selectContentTab } = useContentTabSelect()

  const tabElementClass = (value: ContentTabType) =>
    createClassNameWithModifiers({
      rootClass: 'content-tab__button-el',
      modifiers: [value === selectedContentTab && 'active']
    })

  return (
    <div className="content-tab">
      {BUTTONS.map(({ Component, value }) => (
        <button type="button" key={value} className={tabElementClass(value)} onClick={() => selectContentTab(value)}>
          <Component />
        </button>
      ))}
    </div>
  )
}
