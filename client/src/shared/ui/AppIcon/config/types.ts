import { ColorModifierType, BaseSizeModifierType } from 'src/shared/ui/config'

export type AppIconSizeType = BaseSizeModifierType | 'xs' | 'xxs' | 'fill'

export interface IAppIconListElement {
  name: AppIconNameType
  AppIcon: AppIconComponentType
}

export interface IAppIconProps {
  name: AppIconNameType
  size?: AppIconSizeType
  color?: ColorModifierType
}

export type AppIconNameType =
  | 'logo'
  | 'eye'
  | 'eye-blocked'
  | 'shield'
  | 'contacts'
  | 'chat'
  | 'calls'
  | 'settings-cog'
  | 'settings-mixer'
  | 'notification'
  | 'exit'
  | 'user-stub'
  | 'loader'
  | 'call'
  | 'cross'
  | 'search'
  | 'plus'
  | 'emoji'
  | 'send'
  | 'paper-clip'
  | 'mail'
  | 'video-call'
  | 'video-call-thin'
  | 'phone-call'
  | 'info'
  | 'arrow-left'
  | 'arrow-down'
  | 'phone-cancel'
  | 'mic'
  | 'mic-muted'
  | 'video-cancel'
  | 'cross-2'
  | 'dash'
  | 'expand'
  | 'google'
  | 'facebook'
  | 'reply'
  | 'forward'
  | 'exclamation'
  | 'image-stub'
  | 'trash'
  | 'warn'
  | 'thunder'
  | 'three-dots'
  | 'three-vertical-dots'
  | 'success'

export type AppIconComponentType = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string
    titleId?: string
    desc?: string
    descId?: string
  }
>
