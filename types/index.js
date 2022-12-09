"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.RouteNames = exports.SocketActions = exports.AuthEndPoints = void 0;
var AuthEndPoints;
(function (AuthEndPoints) {
    AuthEndPoints["REGISTRATION"] = "/api/auth/registration";
    AuthEndPoints["SEND_EMAIL_CONFIRMATION_LINK"] = "/api/auth/send-email-confirmation-link";
    AuthEndPoints["SEND_EMAIL_CONFIRMATION"] = "/api/auth/send-email-confirmation";
    AuthEndPoints["LOGIN"] = "/api/auth/login";
    AuthEndPoints["UPDATE_USER_DATA"] = "/api/auth/user-data/update";
    AuthEndPoints["GET_FILES"] = "/api/image/:filename";
})(AuthEndPoints = exports.AuthEndPoints || (exports.AuthEndPoints = {}));
var SocketActions;
(function (SocketActions) {
    SocketActions["CONNECTION"] = "connection";
    SocketActions["INITIALIZE"] = "initialize";
    SocketActions["DISCONNECT"] = "disconnect";
    SocketActions["GET_ROOMS"] = "get-rooms";
    SocketActions["CREATE_ROOM"] = "create-room";
    SocketActions["SEND_MESSAGE"] = "send-message";
    SocketActions["MESSAGE_DELIVERED"] = "message-delivered";
    SocketActions["ROOM_CREATED"] = "room-created";
    SocketActions["SEARCH_CONTACT"] = "search-contact";
    SocketActions["GET_SEARCHED_CONTACTS"] = "get-searched-contact";
    SocketActions["STATUS_CONTACT"] = "status-contact";
    SocketActions["GET_CONTACTS"] = "get-contacts";
    SocketActions["SAVE_CONTACT"] = "save-contact";
    SocketActions["DELETE_CONTACT"] = "delete-contact";
    SocketActions["USER_TYPING"] = "user-typing";
    SocketActions["GET_USER_TYPING_STATUS"] = "get-user-typing-status";
    SocketActions["CHANGE_MESSAGE_STATUS"] = "change-message-status";
    SocketActions["UPDATE_MESSAGE_STATUS"] = "update-message-status";
})(SocketActions = exports.SocketActions || (exports.SocketActions = {}));
var RouteNames;
(function (RouteNames) {
    RouteNames["SIGN_IN"] = "/sign-in";
    RouteNames["SIGN_UP"] = "/sign-up";
    RouteNames["WAIT_EMAIL_CONFIRM"] = "/wait-email-confirm";
    RouteNames["EMAIL_CONFIRM"] = "/confirm-email";
    RouteNames["MAIN"] = "/app";
})(RouteNames = exports.RouteNames || (exports.RouteNames = {}));
var Status;
(function (Status) {
    Status[Status["SUCCESS"] = 200] = "SUCCESS";
    Status[Status["NOT_AUTH"] = 401] = "NOT_AUTH";
})(Status = exports.Status || (exports.Status = {}));
