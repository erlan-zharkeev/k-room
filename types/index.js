"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketActions = exports.RouteNames = exports.CodesEndPoints = exports.CommonEndPoints = exports.UserEndPoints = exports.AuthEndPoints = exports.InfoItemStatus = exports.CallType = exports.CallStatus = exports.UserSettingKey = exports.Theme = exports.MessageStatus = exports.Author = exports.Status = void 0;
// BASIC
var Status;
(function (Status) {
    Status[Status["success"] = 200] = "success";
    Status[Status["badRequest"] = 400] = "badRequest";
    Status[Status["notAuth"] = 401] = "notAuth";
    Status[Status["tokenExpired"] = 403] = "tokenExpired";
    Status[Status["notFound"] = 404] = "notFound";
    Status[Status["unreachable"] = 503] = "unreachable";
    Status[Status["badGateaway"] = 504] = "badGateaway";
})(Status = exports.Status || (exports.Status = {}));
var Author;
(function (Author) {
    Author["system"] = "system";
    Author["time"] = "time";
})(Author = exports.Author || (exports.Author = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["sending"] = "sending";
    MessageStatus["undelivered"] = "undelivered";
    MessageStatus["delivered"] = "delivered";
    MessageStatus["read"] = "read";
    MessageStatus["none"] = "none";
})(MessageStatus = exports.MessageStatus || (exports.MessageStatus = {}));
var Theme;
(function (Theme) {
    Theme["dark"] = "dark";
    Theme["light"] = "light";
})(Theme = exports.Theme || (exports.Theme = {}));
var UserSettingKey;
(function (UserSettingKey) {
    UserSettingKey["theme"] = "theme";
    UserSettingKey["soundOn"] = "soundOn";
    UserSettingKey["showTooltips"] = "showTooltips";
    UserSettingKey["ableToShowNotification"] = "ableToShowNotification";
    UserSettingKey["selectedChatRoomId"] = "selectedChatRoomId";
    UserSettingKey["asideTab"] = "asideTab";
    UserSettingKey["currentInfoId"] = "currentInfoId";
})(UserSettingKey = exports.UserSettingKey || (exports.UserSettingKey = {}));
var CallStatus;
(function (CallStatus) {
    CallStatus["calling"] = "calling";
    CallStatus["inProgress"] = "in-progress";
    CallStatus["finished"] = "finished";
})(CallStatus = exports.CallStatus || (exports.CallStatus = {}));
var CallType;
(function (CallType) {
    CallType["incoming"] = "incoming";
    CallType["outgoing"] = "outgoing";
    CallType["missed"] = "missed";
})(CallType = exports.CallType || (exports.CallType = {}));
var InfoItemStatus;
(function (InfoItemStatus) {
    InfoItemStatus["read"] = "read";
    InfoItemStatus["unread"] = "unread";
})(InfoItemStatus = exports.InfoItemStatus || (exports.InfoItemStatus = {}));
// ENDPOINTS (!for every endpoints use upper snake case)
var AuthEndPoints;
(function (AuthEndPoints) {
    AuthEndPoints["REGISTRATION"] = "/auth/registration";
    AuthEndPoints["SEND_EMAIL_CONFIRMATION_LINK"] = "/auth/send-email-confirmation-link";
    AuthEndPoints["SEND_EMAIL_CONFIRMATION"] = "/auth/send-email-confirmation";
    AuthEndPoints["LOGIN"] = "/auth/login";
    AuthEndPoints["GOOGLE_LOGIN"] = "/auth/google-login";
    AuthEndPoints["PROVIDER_LOGIN"] = "/auth/provider-login";
    AuthEndPoints["LOGOUT"] = "/auth/logout";
    AuthEndPoints["UPDATE_TOKENS_PAIR"] = "/auth/update-tokens-pair";
})(AuthEndPoints = exports.AuthEndPoints || (exports.AuthEndPoints = {}));
var UserEndPoints;
(function (UserEndPoints) {
    UserEndPoints["GET_USER_DATA"] = "/auth/get-user-data";
    UserEndPoints["UPDATE_USER_DATA"] = "/auth/user-data/update";
    UserEndPoints["RESET_PASSWORD"] = "/user/reset-password";
})(UserEndPoints = exports.UserEndPoints || (exports.UserEndPoints = {}));
var CommonEndPoints;
(function (CommonEndPoints) {
    CommonEndPoints["COMMON_IMAGES"] = "/common-images";
    CommonEndPoints["GET_INFO"] = "/notification";
})(CommonEndPoints = exports.CommonEndPoints || (exports.CommonEndPoints = {}));
var CodesEndPoints;
(function (CodesEndPoints) {
    CodesEndPoints["SEND_EMAIL_CODE_PASSWORD_RECOVERY"] = "/codes/email/password-recovery";
    CodesEndPoints["VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY"] = "/codes/email/validate-email-code-password-recovery";
})(CodesEndPoints = exports.CodesEndPoints || (exports.CodesEndPoints = {}));
var RouteNames;
(function (RouteNames) {
    RouteNames["SIGN_IN"] = "/sign-in";
    RouteNames["SIGN_UP"] = "/sign-up";
    RouteNames["WAIT_EMAIL_CONFIRM"] = "/wait-email-confirm";
    RouteNames["EMAIL_CONFIRM"] = "/confirm-email";
    RouteNames["MAIN"] = "/app";
    RouteNames["NOT_FOUND"] = "/not-found";
    RouteNames["PASSWORD_RECOVERY"] = "/password-recovery";
    RouteNames["CREATE_NEW_PASSWORD"] = "/create-new-password";
    RouteNames["NOTIFICATION"] = "/notification";
    // Don't forget to change path below in nginx manually
    RouteNames["SOCKET_PATH"] = "/app-socket/";
    RouteNames["API"] = "/api/";
})(RouteNames = exports.RouteNames || (exports.RouteNames = {}));
var SocketActions;
(function (SocketActions) {
    SocketActions["CONNECTION"] = "connection";
    SocketActions["RECONNECT"] = "reconnect";
    SocketActions["RECONNECT_ATTEMPT"] = "reconnect_attempt";
    SocketActions["RECONNECT_FAILED"] = "reconnect_failed";
    SocketActions["INITIALIZE"] = "initialize";
    SocketActions["DISCONNECT"] = "disconnect";
    SocketActions["GET_ROOMS"] = "get-rooms";
    SocketActions["CREATE_ROOM"] = "create-room";
    SocketActions["SEND_MESSAGE"] = "send-message";
    SocketActions["MESSAGE_DELIVERED"] = "message-delivered";
    SocketActions["ROOM_CREATED"] = "room-created";
    SocketActions["SEARCH_CONTACT"] = "search-contact";
    SocketActions["GET_SEARCHED_CONTACT"] = "get-searched-contact";
    SocketActions["STATUS_CONTACT"] = "status-contact";
    SocketActions["GET_CONTACTS"] = "get-contacts";
    SocketActions["SAVE_CONTACT"] = "save-contact";
    SocketActions["DELETE_CONTACT"] = "delete-contact";
    SocketActions["USER_TYPING"] = "user-typing";
    SocketActions["GET_USER_TYPING_STATUS"] = "get-user-typing-status";
    SocketActions["CHANGE_MESSAGE_STATUS"] = "change-message-status";
    SocketActions["UPDATE_MESSAGE_STATUS"] = "update-message-status";
    SocketActions["CHANGE_CONTACTS_DATA"] = "change-contacts-data";
    SocketActions["CALL_USER"] = "call-user";
    SocketActions["ANSWER_CALL"] = "answer-call";
    SocketActions["CALL_ACCEPTED"] = "call-accepted";
    SocketActions["CALL_ENDED"] = "call-ended";
    SocketActions["CHANGE_CALL_SETTINGS"] = "change-call-settings";
    SocketActions["CALL_STARTED_AT"] = "call-started-at";
    SocketActions["UPDATE_USER_SETTINGS"] = "update-user-settings";
    SocketActions["UPDATE_CHAT_ROOM"] = "update-chat-room";
    SocketActions["ROOM_DATA_UPDATED"] = "room-data-updated";
    SocketActions["ADD_REACTION"] = "add-reaction";
    SocketActions["UPDATE_MESSAGE_REACTIONS"] = "update-message-reactions";
    SocketActions["DELETE_MESSAGE"] = "delete-message";
    SocketActions["MESSAGE_DELETED"] = "message-deleted";
    SocketActions["ERROR_MESSAGE"] = "error-message";
})(SocketActions = exports.SocketActions || (exports.SocketActions = {}));
