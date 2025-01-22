import { KRoomNotification, NotificationMessage, NotificationType } from "common-types";
import { clientConstants } from "src/client-constants";
import { notification as antdNotification } from "antd";
import { useTypedSelector } from "./use-typed-selector";
import { ReactNode } from "react";

const basicNotificationData: KRoomNotification = {
  key: '',
  message: NotificationMessage.default,
  description: '',
  messageType: NotificationType.info,
  duration: 3,
  placement: 'top'
}

export type UseNotification = ReturnType<typeof useNotification>

type CurrentNotification = KRoomNotification<NotificationMessage | ReactNode>

export const useNotification = () => {
  const { ableToShowNotification } = useTypedSelector((state) => state.persist.settings)
  const getNotification = (notification: CurrentNotification) => {
    const messageType = notification.messageType ?? basicNotificationData.messageType as NotificationType
    const isError = messageType === NotificationType.error
    const isInfo = messageType === NotificationType.info
    const placement = isInfo ? 'bottomRight' : 'top'
    const key = notification.key === undefined ? '' : notification.key
    const duration = isError ? clientConstants.errorNotificationDuration : notification.duration !== undefined ? notification.duration : basicNotificationData.duration

    const notificationData: CurrentNotification = {
      ...basicNotificationData,
      ...notification,
      messageType,
      placement,
      duration
    }

    const open = () => {
      if (ableToShowNotification) antdNotification[messageType](notificationData);
    }

    const close = (id: string) => antdNotification.close(id);

    return { open, close, key };
  }

  return {
    getNotification
  }
}