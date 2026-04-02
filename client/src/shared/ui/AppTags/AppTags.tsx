import './style.scss'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { AppButton, AppIcon, AppScrollContainer, AppText } from 'src/shared/ui'

import type { IAppTagsProps } from './config'

export const AppTags = ({ tags, onRemove, onElementClick, title, name, selectedIds, disabled }: IAppTagsProps) => {
  const classNames = createClassNameWithModifiers({ rootClass: 'app-tags', modifiers: [onElementClick && 'clickable'] })
  const tagClassName = createClassNameWithModifiers({ rootClass: 'app-tags__tag', modifiers: [disabled && 'disabled'] })

  return (
    <>
      {tags.length > 0 && (
        <>
          <AppText>{title}</AppText>
          <AppScrollContainer height={'200px'} additionalClassName={classNames}>
            {tags.map((tag) => (
              <div key={tag.value} className={tagClassName} onClick={() => onElementClick?.(tag.value)}>
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
                <div className="app-tags__tag-icon">
                  {selectedIds?.includes(tag.value) && <AppIcon name="success" color="success-color" size="xs" />}
                </div>
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
