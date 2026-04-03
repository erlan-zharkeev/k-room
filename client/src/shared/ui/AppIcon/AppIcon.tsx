// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite-plugin-svgr/client" />
import './style.scss'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { IAppIconListElement, IAppIconProps } from './config'
import LogoIcon from './config/icons/app-logo.svg?react'
import ArrowDownIcon from './config/icons/arrow-down.svg?react'
import ArrowLeftIcon from './config/icons/arrow-left.svg?react'
import CallIcon from './config/icons/call.svg?react'
import ChatIcon from './config/icons/chat.svg?react'
import ContactsIcon from './config/icons/contacts.svg?react'
import Cross2Icon from './config/icons/cross-2.svg?react'
import CrossIcon from './config/icons/cross.svg?react'
import DashIcon from './config/icons/dash.svg?react'
import EmojiIcon from './config/icons/emoji.svg?react'
import ExclamationIcon from './config/icons/exclamation.svg?react'
import ExitIcon from './config/icons/exit.svg?react'
import ExpandIcon from './config/icons/expand.svg?react'
import EyeBlockedIcon from './config/icons/eye-blocked.svg?react'
import EyeIcon from './config/icons/eye.svg?react'
import FacebookIcon from './config/icons/facebook.svg?react'
import ForwardIcon from './config/icons/forward.svg?react'
import GoogleIcon from './config/icons/google.svg?react'
import ImageStubIcon from './config/icons/image-stub.svg?react'
import InfoIcon from './config/icons/info.svg?react'
import LoaderIcon from './config/icons/loader.svg?react'
import MailIcon from './config/icons/mail.svg?react'
import MicMutedIcon from './config/icons/mic-muted.svg?react'
import MicIcon from './config/icons/mic.svg?react'
import NotificationIcon from './config/icons/notification.svg?react'
import PaperClipIcon from './config/icons/paper-clip.svg?react'
import PhoneCancelIcon from './config/icons/phone-cancel.svg?react'
import PlusIcon from './config/icons/plus.svg?react'
import ReplyIcon from './config/icons/reply.svg?react'
import SearchIcon from './config/icons/search.svg?react'
import SendIcon from './config/icons/send.svg?react'
import SettingsIcon from './config/icons/settings.svg?react'
import ShieldIcon from './config/icons/shield.svg?react'
import SuccessIcon from './config/icons/success.svg?react'
import ThreeDotsIcon from './config/icons/three-dots.svg?react'
import ThreeVerticalsDotsIcon from './config/icons/three-vertical-dots.svg?react'
import ThunderIcon from './config/icons/thunder.svg?react'
import TrashIcon from './config/icons/trash.svg?react'
import UserStubIcon from './config/icons/user-stub.svg?react'
import VideoCallThin from './config/icons/video-call-thin.svg?react'
import VideoCallIcon from './config/icons/video-call.svg?react'
import VideoCancel from './config/icons/video-cancel.svg?react'
import WarnIcon from './config/icons/warn.svg?react'

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
