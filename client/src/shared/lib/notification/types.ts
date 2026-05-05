import type { INmorphNotification, NmorphNotificationPlacement } from '@nmorph/nmorph-ui-kit'

export type AppNotificationPlacementType = keyof typeof NmorphNotificationPlacement

export type AppNotificationType = NonNullable<INmorphNotification['type']>

export interface IAppNotificationInput extends INmorphNotification {
  placement?: AppNotificationPlacementType
}

export interface IAppNotification extends INmorphNotification {
  placement: AppNotificationPlacementType
}
