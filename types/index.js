"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallType = exports.CallStatus = exports.Theme = exports.MessageStatus = exports.Status = exports.SocketActions = exports.RouteNames = exports.CodesEndPoints = exports.CommonEndPoints = exports.UserEndPoints = exports.AuthEndPoints = void 0;
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
    SocketActions["connection"] = "connection";
    SocketActions["reconnect"] = "reconnect";
    SocketActions["reconnect-attempt"] = "reconnect_attempt";
    SocketActions["reconnect-failed"] = "reconnect_failed";
    SocketActions["initialize"] = "initialize";
    SocketActions["disconnect"] = "disconnect";
    SocketActions["get-rooms"] = "get-rooms";
    SocketActions["create-room"] = "create-room";
    SocketActions["send-message"] = "send-message";
    SocketActions["message-delivered"] = "message-delivered";
    SocketActions["room-created"] = "room-created";
    SocketActions["search-contact"] = "search-contact";
    SocketActions["get-searched-contact"] = "get-searched-contact";
    SocketActions["status-contact"] = "status-contact";
    SocketActions["get-contacts"] = "get-contacts";
    SocketActions["save-contact"] = "save-contact";
    SocketActions["delete-contact"] = "delete-contact";
    SocketActions["user-typing"] = "user-typing";
    SocketActions["get-user-typing-status"] = "get-user-typing-status";
    SocketActions["change-message-status"] = "change-message-status";
    SocketActions["update-message-status"] = "update-message-status";
    SocketActions["change-contacts-data"] = "change-contacts-data";
    SocketActions["call-user"] = "call-user";
    SocketActions["answer-call"] = "answer-call";
    SocketActions["call-accepted"] = "call-accepted";
    SocketActions["call-ended"] = "call-ended";
    SocketActions["change-call-settings"] = "change-call-settings";
    SocketActions["call-started-at"] = "call-started-at";
    SocketActions["update-user-settings"] = "update-user-settings";
    SocketActions["update-chat-room"] = "update-chat-room";
    SocketActions["room-data-updated"] = "room-data-updated";
    SocketActions["add-reaction"] = "add-reaction";
    SocketActions["update-message-reactions"] = "update-message-reactions";
    SocketActions["delete-message"] = "delete-message";
})(SocketActions = exports.SocketActions || (exports.SocketActions = {}));
var Status;
(function (Status) {
    Status[Status["success"] = 200] = "success";
    Status[Status["bad-request"] = 400] = "bad-request";
    Status[Status["not-auth"] = 401] = "not-auth";
    Status[Status["token-expired"] = 403] = "token-expired";
    Status[Status["not-found"] = 404] = "not-found";
    Status[Status["unreachable"] = 503] = "unreachable";
    Status[Status["bad-gateaway"] = 504] = "bad-gateaway";
})(Status = exports.Status || (exports.Status = {}));
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
var CallStatus;
(function (CallStatus) {
    CallStatus["calling"] = "calling";
    CallStatus["in-progress"] = "in-progress";
    CallStatus["finished"] = "finished";
})(CallStatus = exports.CallStatus || (exports.CallStatus = {}));
var CallType;
(function (CallType) {
    CallType["incoming"] = "incoming";
    CallType["outgoing"] = "outgoing";
    CallType["missed"] = "missed";
})(CallType = exports.CallType || (exports.CallType = {}));
