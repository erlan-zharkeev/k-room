import { InfoNotificationMapType } from 'common/info-notification';
import { USER_ROLES } from './constants';
export type UserRoleType = (typeof USER_ROLES)[number];
export interface IBaseFrontendUserData {
    id: string;
    username: string;
}
export interface IFrontendUserData extends IBaseFrontendUserData {
    role: UserRoleType;
    email: string;
    infoNotifications: InfoNotificationMapType;
}
