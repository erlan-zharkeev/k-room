import { SETTINGS_PAGE_ROADMAP_I18N } from '../i18n/roadmap.i18n'
import type { RoadmapItem, RoadmapItemStatus } from '../types/roadmap.types'

export const ROADMAP_STATUS_I18N: Record<RoadmapItemStatus, string> = {
  planned: SETTINGS_PAGE_ROADMAP_I18N.statusPlanned,
  design: SETTINGS_PAGE_ROADMAP_I18N.statusDesign,
  research: SETTINGS_PAGE_ROADMAP_I18N.statusResearch
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 'scheduled-messages',
    status: 'planned',
    title: SETTINGS_PAGE_ROADMAP_I18N.scheduledMessagesTitle,
    description: SETTINGS_PAGE_ROADMAP_I18N.scheduledMessagesDescription
  },
  {
    id: 'camera-capture',
    status: 'planned',
    title: SETTINGS_PAGE_ROADMAP_I18N.cameraCaptureTitle,
    description: SETTINGS_PAGE_ROADMAP_I18N.cameraCaptureDescription
  },
  {
    id: 'secure-chats',
    status: 'research',
    title: SETTINGS_PAGE_ROADMAP_I18N.secureChatsTitle,
    description: SETTINGS_PAGE_ROADMAP_I18N.secureChatsDescription
  },
  {
    id: 'message-drafts',
    status: 'design',
    title: SETTINGS_PAGE_ROADMAP_I18N.messageDraftsTitle,
    description: SETTINGS_PAGE_ROADMAP_I18N.messageDraftsDescription
  },
  {
    id: 'audio-activity',
    status: 'planned',
    title: SETTINGS_PAGE_ROADMAP_I18N.audioActivityTitle,
    description: SETTINGS_PAGE_ROADMAP_I18N.audioActivityDescription
  },
  {
    id: 'conference-recording',
    status: 'research',
    title: SETTINGS_PAGE_ROADMAP_I18N.conferenceRecordingTitle,
    description: SETTINGS_PAGE_ROADMAP_I18N.conferenceRecordingDescription
  },
  {
    id: 'support-chat',
    status: 'planned',
    title: SETTINGS_PAGE_ROADMAP_I18N.supportChatTitle,
    description: SETTINGS_PAGE_ROADMAP_I18N.supportChatDescription
  }
]
