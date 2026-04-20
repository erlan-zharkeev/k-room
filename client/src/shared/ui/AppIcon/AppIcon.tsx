/// <reference types="vite-plugin-svgr/client" />
import './style.scss'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { IAppIconListElement, IAppIconProps } from './internals'
import LogoIcon from './internals/icons/app-logo.svg?react'
import ArrowDownIcon from './internals/icons/arrow-down.svg?react'
import ArrowLeftIcon from './internals/icons/arrow-left.svg?react'
import CallIcon from './internals/icons/call.svg?react'
import ChatIcon from './internals/icons/chat.svg?react'
import ContactsIcon from './internals/icons/contacts.svg?react'
import Cross2Icon from './internals/icons/cross-2.svg?react'
import CrossIcon from './internals/icons/cross.svg?react'
import DashIcon from './internals/icons/dash.svg?react'
import EmojiIcon from './internals/icons/emoji.svg?react'
import ExclamationIcon from './internals/icons/exclamation.svg?react'
import ExitIcon from './internals/icons/exit.svg?react'
import ExpandIcon from './internals/icons/expand.svg?react'
import EyeBlockedIcon from './internals/icons/eye-blocked.svg?react'
import EyeIcon from './internals/icons/eye.svg?react'
import FacebookIcon from './internals/icons/facebook.svg?react'
import ForwardIcon from './internals/icons/forward.svg?react'
import GoogleIcon from './internals/icons/google.svg?react'
import ImageStubIcon from './internals/icons/image-stub.svg?react'
import InfoIcon from './internals/icons/info.svg?react'
import LoaderIcon from './internals/icons/loader.svg?react'
import MailIcon from './internals/icons/mail.svg?react'
import MicMutedIcon from './internals/icons/mic-muted.svg?react'
import MicIcon from './internals/icons/mic.svg?react'
import NotificationIcon from './internals/icons/notification.svg?react'
import PaperClipIcon from './internals/icons/paper-clip.svg?react'
import PhoneCancelIcon from './internals/icons/phone-cancel.svg?react'
import PlusIcon from './internals/icons/plus.svg?react'
import ReplyIcon from './internals/icons/reply.svg?react'
import SearchIcon from './internals/icons/search.svg?react'
import SendIcon from './internals/icons/send.svg?react'
import SettingsIcon from './internals/icons/settings.svg?react'
import ShieldIcon from './internals/icons/shield.svg?react'
import SuccessIcon from './internals/icons/success.svg?react'
import ThreeDotsIcon from './internals/icons/three-dots.svg?react'
import ThreeVerticalsDotsIcon from './internals/icons/three-vertical-dots.svg?react'
import ThunderIcon from './internals/icons/thunder.svg?react'
import TrashIcon from './internals/icons/trash.svg?react'
import UserStubIcon from './internals/icons/user-stub.svg?react'
import VideoCallThin from './internals/icons/video-call-thin.svg?react'
import VideoCallIcon from './internals/icons/video-call.svg?react'
import VideoCancel from './internals/icons/video-cancel.svg?react'
import WarnIcon from './internals/icons/warn.svg?react'

export const IconList: IAppIconListElement[] = [
  { name: 'logo', AppIcon: LogoIcon },
  { name: 'shield', AppIcon: ShieldIcon },
  { name: 'contacts', AppIcon: ContactsIcon },
  { name: 'chat', AppIcon: ChatIcon },
  { name: 'settings-cog', AppIcon: SettingsIcon },
  { name: 'notification', AppIcon: NotificationIcon },
  { name: 'exit', AppIcon: ExitIcon },
  { name: 'user-stub', AppIcon: UserStubIcon },
  { name: 'loader', AppIcon: LoaderIcon },
  { name: 'call', AppIcon: CallIcon },
  { name: 'cross', AppIcon: CrossIcon },
  { name: 'search', AppIcon: SearchIcon },
  { name: 'plus', AppIcon: PlusIcon },
  { name: 'emoji', AppIcon: EmojiIcon },
  { name: 'send', AppIcon: SendIcon },
  { name: 'success', AppIcon: SuccessIcon },
  { name: 'paper-clip', AppIcon: PaperClipIcon },
  { name: 'mail', AppIcon: MailIcon },
  { name: 'video-call', AppIcon: VideoCallIcon },
  { name: 'video-call-thin', AppIcon: VideoCallThin },
  { name: 'video-cancel', AppIcon: VideoCancel },
  { name: 'info', AppIcon: InfoIcon },
  { name: 'arrow-left', AppIcon: ArrowLeftIcon },
  { name: 'arrow-down', AppIcon: ArrowDownIcon },
  { name: 'phone-cancel', AppIcon: PhoneCancelIcon },
  { name: 'mic', AppIcon: MicIcon },
  { name: 'mic-muted', AppIcon: MicMutedIcon },
  { name: 'cross-2', AppIcon: Cross2Icon },
  { name: 'dash', AppIcon: DashIcon },
  { name: 'expand', AppIcon: ExpandIcon },
  { name: 'google', AppIcon: GoogleIcon },
  { name: 'facebook', AppIcon: FacebookIcon },
  { name: 'reply', AppIcon: ReplyIcon },
  { name: 'forward', AppIcon: ForwardIcon },
  { name: 'exclamation', AppIcon: ExclamationIcon },
  { name: 'image-stub', AppIcon: ImageStubIcon },
  { name: 'trash', AppIcon: TrashIcon },
  { name: 'warn', AppIcon: WarnIcon },
  { name: 'thunder', AppIcon: ThunderIcon },
  { name: 'eye', AppIcon: EyeIcon },
  { name: 'eye-blocked', AppIcon: EyeBlockedIcon },
  { name: 'three-dots', AppIcon: ThreeDotsIcon },
  { name: 'three-vertical-dots', AppIcon: ThreeVerticalsDotsIcon }
]

export const AppIcon = ({ name, color = 'text-color', size = 'small' }: IAppIconProps) => {
  const AppIcon = IconList.find((IconElement) => IconElement.name === name)?.AppIcon

  const className = createClassNameWithModifiers({ rootClass: 'app-icon', modifiers: [name, size, color] })
  return <div className={className}>{AppIcon && <AppIcon />}</div>
}
