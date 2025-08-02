import './style.scss'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { AppButton } from '../AppButton/AppButton'
import { AppScrollContainer } from '../AppScrollContainer/AppScrollContainer'
import { AppText } from '../AppText/AppText'

import type { IAppTagsProps } from './types'

export const AppTags = ({ tags, onRemove, onElementClick, title, name }: IAppTagsProps) => {
  const classNames = createClassNameWithModifiers({ rootClass: 'app-tags', modifiers: [onElementClick && 'clickable'] })

  return (
    <>
      {tags.length > 0 && (
        <>
          <AppText>{title}</AppText>
          <AppScrollContainer height={'200px'} additionalClassName={classNames}>
            {tags.map((tag) => (
              <div key={tag.value} className="app-tags__tag" onClick={() => onElementClick?.(tag.value)}>
                {tag.prefixSlot && (
                  <div
                    className="app-tags__tag-prefix-slot"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    {tag.prefixSlot}
                  </div>
                )}
                <AppText>{tag.label}</AppText>
                {onRemove && (
                  <AppButton
                    prefixIconName="cross"
                    borderless
                    additionalClassName="app-tags__cross"
                    onClick={() => onRemove(tag.value)}
                  />
                )}
              </div>
            ))}
          </AppScrollContainer>
        </>
      )}
      {name && <input type="hidden" name={name} value={tags.map((t) => t.value).join(',')} />}
    </>
  )
}
