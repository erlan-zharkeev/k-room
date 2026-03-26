// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite-plugin-svgr/client" />
import './style.scss'

import type { IAppIconListElement, IAppIconProps } from 'src/shared/ui/AppIcon/config'
import LogoIcon from 'src/shared/ui/AppIcon/config/icons/app-logo.svg?react'
import ArrowDownIcon from 'src/shared/ui/AppIcon/config/icons/arrow-down.svg?react'
import ArrowLeftIcon from 'src/shared/ui/AppIcon/config/icons/arrow-left.svg?react'
import CallIcon from 'src/shared/ui/AppIcon/config/icons/call.svg?react'
import ChatIcon from 'src/shared/ui/AppIcon/config/icons/chat.svg?react'
import ContactsIcon from 'src/shared/ui/AppIcon/config/icons/contacts.svg?react'
import Cross2Icon from 'src/shared/ui/AppIcon/config/icons/cross-2.svg?react'
import CrossIcon from 'src/shared/ui/AppIcon/config/icons/cross.svg?react'
import DashIcon from 'src/shared/ui/AppIcon/config/icons/dash.svg?react'
import EmojiIcon from 'src/shared/ui/AppIcon/config/icons/emoji.svg?react'
import ExclamationIcon from 'src/shared/ui/AppIcon/config/icons/exclamation.svg?react'
import ExitIcon from 'src/shared/ui/AppIcon/config/icons/exit.svg?react'
import ExpandIcon from 'src/shared/ui/AppIcon/config/icons/expand.svg?react'
import EyeBlockedIcon from 'src/shared/ui/AppIcon/config/icons/eye-blocked.svg?react'
import EyeIcon from 'src/shared/ui/AppIcon/config/icons/eye.svg?react'
import FacebookIcon from 'src/shared/ui/AppIcon/config/icons/facebook.svg?react'
import ForwardIcon from 'src/shared/ui/AppIcon/config/icons/forward.svg?react'
import GoogleIcon from 'src/shared/ui/AppIcon/config/icons/google.svg?react'
import ImageStubIcon from 'src/shared/ui/AppIcon/config/icons/image-stub.svg?react'
import InfoIcon from 'src/shared/ui/AppIcon/config/icons/info.svg?react'
import LoaderIcon from 'src/shared/ui/AppIcon/config/icons/loader.svg?react'
import MailIcon from 'src/shared/ui/AppIcon/config/icons/mail.svg?react'
import MicMutedIcon from 'src/shared/ui/AppIcon/config/icons/mic-muted.svg?react'
import MicIcon from 'src/shared/ui/AppIcon/config/icons/mic.svg?react'
import NotificationIcon from 'src/shared/ui/AppIcon/config/icons/notification.svg?react'
import PaperClipIcon from 'src/shared/ui/AppIcon/config/icons/paper-clip.svg?react'
import PhoneCancelIcon from 'src/shared/ui/AppIcon/config/icons/phone-cancel.svg?react'
import PlusIcon from 'src/shared/ui/AppIcon/config/icons/plus.svg?react'
import ReplyIcon from 'src/shared/ui/AppIcon/config/icons/reply.svg?react'
import SearchIcon from 'src/shared/ui/AppIcon/config/icons/search.svg?react'
import SendIcon from 'src/shared/ui/AppIcon/config/icons/send.svg?react'
import SettingsIcon from 'src/shared/ui/AppIcon/config/icons/settings.svg?react'
import ShieldIcon from 'src/shared/ui/AppIcon/config/icons/shield.svg?react'
import SuccessIcon from 'src/shared/ui/AppIcon/config/icons/success.svg?react'
import ThreeDotsIcon from 'src/shared/ui/AppIcon/config/icons/three-dots.svg?react'
import ThreeVerticalsDotsIcon from 'src/shared/ui/AppIcon/config/icons/three-vertical-dots.svg?react'
import ThunderIcon from 'src/shared/ui/AppIcon/config/icons/thunder.svg?react'
import TrashIcon from 'src/shared/ui/AppIcon/config/icons/trash.svg?react'
import UserStubIcon from 'src/shared/ui/AppIcon/config/icons/user-stub.svg?react'
import VideoCallThin from 'src/shared/ui/AppIcon/config/icons/video-call-thin.svg?react'
import VideoCallIcon from 'src/shared/ui/AppIcon/config/icons/video-call.svg?react'
import VideoCancel from 'src/shared/ui/AppIcon/config/icons/video-cancel.svg?react'
import WarnIcon from 'src/shared/ui/AppIcon/config/icons/warn.svg?react'
import { createClassNameWithModifiers } from 'src/shared/utils'

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
