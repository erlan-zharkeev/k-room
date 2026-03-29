export type * from 'src/shared/ui/AppCollapseList/config'
export type * from 'src/shared/ui/AppTags/config'

export type BaseSizeModifierType = 'small' | 'medium' | 'large'
export type ExtendedSizeModifierType = BaseSizeModifierType | 'extra-small' | 'extra-large'
export type ShapeModifierType = 'square-shape' | 'default-shape' | 'circle-shape'
export type ColorModifierType =
  | 'text-color'
  | 'accent-color'
  | 'success-color'
  | 'error-color'
  | 'warn-color'
  | 'white-color'
  | 'black-color'
export type AvatarShapeModifierType = Extract<ShapeModifierType, 'square-shape' | 'circle-shape'>
