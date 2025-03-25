/// <reference types="vite-plugin-svgr/client" />
import './style.scss'
import { createClassNameWithModifiers } from 'src/shared/utils'
import { AppIconListElement, AppIconProps } from './types'
import LogoIcon from './icons/app-logo.svg?react'
import ContactsIcon from './icons/contacts.svg?react'
import ShieldIcon from './icons/shield.svg?react'
import ChatIcon from './icons/chat.svg?react'
import SettingsIcon from './icons/settings.svg?react'
import NotificationIcon from './icons/notification.svg?react'
import ExitIcon from './icons/exit.svg?react'
import UserStubIcon from './icons/user-stub.svg?react'
import LoaderIcon from './icons/loader.svg?react'
import CallIcon from './icons/call.svg?react'
import CrossIcon from './icons/cross.svg?react'
import SearchIcon from './icons/search.svg?react'
import PlusIcon from './icons/plus.svg?react'
import EmojiIcon from './icons/emoji.svg?react'
import SendIcon from './icons/send.svg?react'
import PaperClipIcon from './icons/paper-clip.svg?react'
import MailIcon from './icons/mail.svg?react'
import VideoCallIcon from './icons/video-call.svg?react'
import VideoCallThin from './icons/video-call-thin.svg?react'
import VideoCancel from './icons/video-cancel.svg?react'
import InfoIcon from './icons/info.svg?react'
import ArrowLeftIcon from './icons/arrow-left.svg?react'
import PhoneCancelIcon from './icons/phone-cancel.svg?react'
import MicIcon from './icons/mic.svg?react'
import MicMutedIcon from './icons/mic-muted.svg?react'
import Cross2Icon from './icons/cross-2.svg?react'
import DashIcon from './icons/dash.svg?react'
import ExpandIcon from './icons/expand.svg?react'
import GoogleIcon from './icons/google.svg?react'
import FacebookIcon from './icons/facebook.svg?react'
import ReplyIcon from './icons/reply.svg?react'
import ForwardIcon from './icons/forward.svg?react'
import ExclamationIcon from './icons/exclamation.svg?react'
import ImageStubIcon from './icons/image-stub.svg?react'
import TrashIcon from './icons/trash.svg?react'
import WarnIcon from './icons/warn.svg?react'
import ThunderIcon from './icons/thunder.svg?react'
import EyeIcon from './icons/eye.svg?react'
import EyeBlockedIcon from './icons/eye-blocked.svg?react'

export const IconList: Array<AppIconListElement> = [
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
  { name: 'paper-clip', AppIcon: PaperClipIcon },
  { name: 'mail', AppIcon: MailIcon },
  { name: 'video-call', AppIcon: VideoCallIcon },
  { name: 'video-call-thin', AppIcon: VideoCallThin },
  { name: 'video-cancel', AppIcon: VideoCancel },
  { name: 'info', AppIcon: InfoIcon },
  { name: 'arrow-left', AppIcon: ArrowLeftIcon },
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
  { name: 'eye-blocked', AppIcon: EyeBlockedIcon }
]

export const AppIcon = ({ name, color = 'text-color', size = 'small' }: AppIconProps) => {
  const AppIcon = IconList.find((IconElement) => IconElement.name === name)?.AppIcon
  const className = createClassNameWithModifiers({ rootClass: 'app-icon', modifiers: [name, size, color] })
  return <div className={className}>{AppIcon && <AppIcon />}</div>
}
