import { ImUsers } from 'react-icons/im'
import { IoChatboxEllipsesSharp, IoNotificationsSharp, IoCallSharp, IoInformationCircleOutline } from 'react-icons/io5'
import { TbPhoneCall } from 'react-icons/tb'
import { FiSettings } from 'react-icons/fi'
import { GoSettings, GoSearch } from 'react-icons/go'
import IconListElement from './@types/IconList'
import { MdExitToApp, MdOutlineArrowBackIos } from 'react-icons/md'
import { FaUserCircle, FaPhoneSlash } from 'react-icons/fa'
import { RiLoader5Fill } from 'react-icons/ri'
import { RxCrossCircled, RxCross2 } from 'react-icons/rx'
import {
  BsPlusCircle,
  BsEmojiSmile,
  BsMicMuteFill,
  BsMicFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsDashLg
} from 'react-icons/bs'
import { AiOutlineSend } from 'react-icons/ai'
import { HiOutlinePaperClip } from 'react-icons/hi'
import { IoMdMail, IoIosCall } from 'react-icons/io'
import { CgArrowsExpandLeft } from 'react-icons/cg'

export const IconList: Array<IconListElement> = [
  { name: 'contacts', Icon: ImUsers },
  { name: 'chats', Icon: IoChatboxEllipsesSharp },
  { name: 'calls', Icon: TbPhoneCall },
  { name: 'settings-cog', Icon: FiSettings },
  { name: 'settings-mixer', Icon: GoSettings },
  { name: 'notification-bell', Icon: IoNotificationsSharp },
  { name: 'exit', Icon: MdExitToApp },
  { name: 'user-stub', Icon: FaUserCircle },
  { name: 'loader', Icon: RiLoader5Fill },
  { name: 'call', Icon: IoCallSharp },
  { name: 'cross', Icon: RxCrossCircled },
  { name: 'search', Icon: GoSearch },
  { name: 'plus', Icon: BsPlusCircle },
  { name: 'emoji', Icon: BsEmojiSmile },
  { name: 'send', Icon: AiOutlineSend },
  { name: 'paper-clip', Icon: HiOutlinePaperClip },
  { name: 'mail', Icon: IoMdMail },
  { name: 'video-call', Icon: BsCameraVideoFill },
  { name: 'video-drop', Icon: BsCameraVideoOffFill },
  { name: 'phone-call', Icon: IoIosCall },
  { name: 'info', Icon: IoInformationCircleOutline },
  { name: 'arrow-left', Icon: MdOutlineArrowBackIos },
  { name: 'phone-drop', Icon: FaPhoneSlash },
  { name: 'mic', Icon: BsMicFill },
  { name: 'mic-muted', Icon: BsMicMuteFill },
  { name: 'cross-2', Icon: RxCross2 },
  { name: 'dash', Icon: BsDashLg },
  { name: 'expand', Icon: CgArrowsExpandLeft }
]

export default IconList
