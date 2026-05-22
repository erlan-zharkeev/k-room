export type { CollapseItem, AppCollapseProps } from 'src/shared/ui/AppCollapseList/internals/types'
export type { AppTag, AppTagsProps } from 'src/shared/ui/AppTags/internals/types'

export type BaseSizeModifier = 'small' | 'medium' | 'large'
export type ExtendedSizeModifier = BaseSizeModifier | 'extra-small' | 'extra-large'
export type ShapeModifier = 'square-shape' | 'default-shape' | 'circle-shape'
export type ColorModifier =
  | 'text-color'
  | 'accent-color'
  | 'success-color'
  | 'error-color'
  | 'warn-color'
  | 'white-color'
  | 'black-color'
export type AvatarShapeModifier = Extract<ShapeModifier, 'square-shape' | 'circle-shape'>
