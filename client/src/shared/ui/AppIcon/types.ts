import type { ColorModifier, BaseSizeModifier } from '../types'

export type AppIconSize = BaseSizeModifier | 'xs' | 'xxs' | 'fill'

export interface IAppIconListElement {
  name: AppIconName
  AppIcon: AppIconComponent
}

export interface IAppIconProps {
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
  | 'three-vertical-dots'
  | 'success'

export type AppIconComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string
    titleId?: string
    desc?: string
    descId?: string
  }
>
