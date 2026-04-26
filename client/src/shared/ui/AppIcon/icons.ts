import AppLogoIcon from './icons/app-logo.svg?raw'
import ArrowDownIcon from './icons/arrow-down.svg?raw'
import ArrowLeftIcon from './icons/arrow-left.svg?raw'
import CallIcon from './icons/call.svg?raw'
import ChatIcon from './icons/chat.svg?raw'
import ContactsIcon from './icons/contacts.svg?raw'
import Cross2Icon from './icons/cross-2.svg?raw'
import CrossIcon from './icons/cross.svg?raw'
import DashIcon from './icons/dash.svg?raw'
import EmojiIcon from './icons/emoji.svg?raw'
import ExclamationIcon from './icons/exclamation.svg?raw'
import ExitIcon from './icons/exit.svg?raw'
import ExpandIcon from './icons/expand.svg?raw'
import EyeBlockedIcon from './icons/eye-blocked.svg?raw'
import EyeIcon from './icons/eye.svg?raw'
import FacebookIcon from './icons/facebook.svg?raw'
import ForwardIcon from './icons/forward.svg?raw'
import GoogleIcon from './icons/google.svg?raw'
import ImageStubIcon from './icons/image-stub.svg?raw'
import InfoIcon from './icons/info.svg?raw'
import LoaderIcon from './icons/loader.svg?raw'
import MailIcon from './icons/mail.svg?raw'
import MicMutedIcon from './icons/mic-muted.svg?raw'
import MicIcon from './icons/mic.svg?raw'
import NotificationIcon from './icons/notification.svg?raw'
import PaperClipIcon from './icons/paper-clip.svg?raw'
import PhoneCallIcon from './icons/phone-call.svg?raw'
import PhoneCancelIcon from './icons/phone-cancel.svg?raw'
import PhoneIcon from './icons/phone.svg?raw'
import PlusIcon from './icons/plus.svg?raw'
import ReplyIcon from './icons/reply.svg?raw'
import SearchIcon from './icons/search.svg?raw'
import SendIcon from './icons/send.svg?raw'
import SettingsIcon from './icons/settings.svg?raw'
import ShieldIcon from './icons/shield.svg?raw'
import SuccessIcon from './icons/success.svg?raw'
import ThreeDotsIcon from './icons/three-dots.svg?raw'
import ThreeVerticalDotsIcon from './icons/three-vertical-dots.svg?raw'
import ThunderIcon from './icons/thunder.svg?raw'
import TrashIcon from './icons/trash.svg?raw'
import UserStubIcon from './icons/user-stub.svg?raw'
import UsersIcon from './icons/users.svg?raw'
import VideoCallThinIcon from './icons/video-call-thin.svg?raw'
import VideoCallIcon from './icons/video-call.svg?raw'
import VideoCancelIcon from './icons/video-cancel.svg?raw'
import WarnIcon from './icons/warn.svg?raw'
import type { AppIconNameType } from './types'

export const APP_ICON_MAP: Record<AppIconNameType, string> = {
  logo: AppLogoIcon,
  eye: EyeIcon,
  'eye-blocked': EyeBlockedIcon,
  shield: ShieldIcon,
  contacts: ContactsIcon,
  chat: ChatIcon,
  users: UsersIcon,
  settings: SettingsIcon,
  notification: NotificationIcon,
  exit: ExitIcon,
  'user-stub': UserStubIcon,
  loader: LoaderIcon,
  call: CallIcon,
  phone: PhoneIcon,
  cross: CrossIcon,
  search: SearchIcon,
  plus: PlusIcon,
  emoji: EmojiIcon,
  send: SendIcon,
  'paper-clip': PaperClipIcon,
  mail: MailIcon,
  'video-call': VideoCallIcon,
  'video-call-thin': VideoCallThinIcon,
  'phone-call': PhoneCallIcon,
  info: InfoIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-down': ArrowDownIcon,
  'phone-cancel': PhoneCancelIcon,
  mic: MicIcon,
  'mic-muted': MicMutedIcon,
  'video-cancel': VideoCancelIcon,
  'cross-2': Cross2Icon,
  dash: DashIcon,
  expand: ExpandIcon,
  google: GoogleIcon,
  facebook: FacebookIcon,
  reply: ReplyIcon,
  forward: ForwardIcon,
  exclamation: ExclamationIcon,
  'image-stub': ImageStubIcon,
  trash: TrashIcon,
  warn: WarnIcon,
  thunder: ThunderIcon,
  'three-dots': ThreeDotsIcon,
  'three-vertical-dots': ThreeVerticalDotsIcon,
  success: SuccessIcon
}
