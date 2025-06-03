import { ColorModifier, BaseSizeModifier } from '../types'

export type AppIconSize = BaseSizeModifier | 'xs' | 'xxs' | 'fill'

export interface AppIconListElement {
  name: AppIconName
  AppIcon: AppIconComponent
}

export interface AppIconProps {
  name: AppIconName
  size?: AppIconSize
  color?: ColorModifier
}

export type AppIconName =
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

export type AppIconComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string
    titleId?: string
    desc?: string
    descId?: string
  }
>
