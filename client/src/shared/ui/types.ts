export type SizeModifier = 'small' | 'medium' | 'large'
export type ShapeModifier = 'square-shape' | 'default-shape' | 'circle-shape'
export type ColorModifier =
  | 'text-color'
  | 'accent-color'
  | 'success-color'
  | 'error-color'
  | 'warn-color'
  | 'white-color'
  | 'black-color'
export type AvatarLoaderShapeModifier = Extract<ShapeModifier, 'square-shape' | 'circle-shape'>
