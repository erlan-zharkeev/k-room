import type { I18nKey } from 'src/shared/lib'

export type RoadmapItemStatus = 'planned' | 'design' | 'research'
export type RoadmapText = I18nKey

export interface RoadmapItem {
  id: string
  status: RoadmapItemStatus
  title: RoadmapText
  description: RoadmapText
}

export interface ResolvedRoadmapItem {
  id: string
  statusText: string
  title: string
  description: string
}
