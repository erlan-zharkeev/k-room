"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokens = exports.SocketActions = exports.RouteNames = exports.CodesEndPoints = exports.CommonEndPoints = exports.UserEndPoints = exports.AuthEndPoints = exports.NotificationMessage = exports.NotificationType = exports.InfoItemStatus = exports.UserMediaType = exports.CallType = exports.CallStatus = exports.AsideBarButtonName = exports.UserSettingKey = exports.Theme = exports.MessageStatus = exports.Author = exports.Status = void 0;
// BASIC
var Status;
(function (Status) {
    Status[Status["success"] = 200] = "success";
    Status[Status["badRequest"] = 400] = "badRequest";
    Status[Status["notAuth"] = 401] = "notAuth";
    Status[Status["notFound"] = 404] = "notFound";
    Status[Status["unreachable"] = 503] = "unreachable";
    Status[Status["badGateway"] = 504] = "badGateway";
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
var AsideBarButtonName;
(function (AsideBarButtonName) {
    AsideBarButtonName["contacts"] = "contacts";
    AsideBarButtonName["chatList"] = "chatList";
    AsideBarButtonName["calls"] = "calls";
    AsideBarButtonName["settings"] = "settings";
    AsideBarButtonName["info"] = "info";
})(AsideBarButtonName = exports.AsideBarButtonName || (exports.AsideBarButtonName = {}));
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
    CallType["notAnswered"] = "not-answered";
    CallType["current"] = "current";
})(CallType = exports.CallType || (exports.CallType = {}));
var UserMediaType;
(function (UserMediaType) {
    UserMediaType["audio"] = "audio";
    UserMediaType["video"] = "video";
})(UserMediaType = exports.UserMediaType || (exports.UserMediaType = {}));
var InfoItemStatus;
(function (InfoItemStatus) {
    InfoItemStatus["read"] = "read";
    InfoItemStatus["unread"] = "unread";
})(InfoItemStatus = exports.InfoItemStatus || (exports.InfoItemStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["success"] = "success";
    NotificationType["error"] = "error";
    NotificationType["info"] = "info";
    NotificationType["warn"] = "warning";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
var NotificationMessage;
(function (NotificationMessage) {
    NotificationMessage["default"] = "";
    NotificationMessage["networkOffline"] = "The internet connection has been terminated. Network problems";
    NotificationMessage["networkOnline"] = "The internet connection has been restored";
    NotificationMessage["cantAccessDevice"] = "Cant get access to video device";
    NotificationMessage["unknownError"] = "An unknown error has occurred";
    NotificationMessage["callCompleted"] = "Call completed";
    NotificationMessage["failedGetStream"] = "Failed to get self stream";
    NotificationMessage["cantSetCallerSignal"] = "Cannot set caller signal";
    NotificationMessage["failedToConnectToDevice"] = "Failed to connect to device, check for device is plugged in";
    NotificationMessage["socketConnected"] = "Connected";
    NotificationMessage["socketDisconnected"] = "Disconnected";
    NotificationMessage["tokensPairUpdated"] = "Token pair is updated";
    NotificationMessage["success"] = "success";
    NotificationMessage["passwordReset"] = "Password changed successfully";
    NotificationMessage["loginSuccess"] = "Login successfully";
    NotificationMessage["loginAndRegister"] = "Login and register successfully";
    NotificationMessage["userDataUpdated"] = "User data updated";
    NotificationMessage["userAddedToContacts"] = "User added to contacts";
    NotificationMessage["userRemovedFromContacts"] = "User removed from contacts";
    NotificationMessage["emailConfirmed"] = "Email confirmed";
    NotificationMessage["checkEmailForCode"] = "Check your email, we have sent you a code";
    NotificationMessage["checkEmailForConfirmationLink"] = "Check your email for confirmation link";
    NotificationMessage["userCreated"] = "User successfully created, checkout your email address for email confirmation";
    NotificationMessage["emailConfirmationLinkSended"] = "Confirmation link sent to email";
    NotificationMessage["failedGetUserData"] = "Failed to get user data";
    NotificationMessage["failedResetPassword"] = "Failed to change password";
    NotificationMessage["invalidConfirmCode"] = "Invalid confirmation code";
    NotificationMessage["failedCodeSend"] = "Code send failed";
    NotificationMessage["commonServerError"] = "Server error, the operation could not be performed. Try later";
    NotificationMessage["failedRegistration"] = "Registration failed, try register later";
    NotificationMessage["failedLogin"] = "Login failed, try register later";
    NotificationMessage["nonAuthorized"] = "User not authorized";
    NotificationMessage["haveNotAccessRights"] = "User have not access rights";
    NotificationMessage["failedUserDataUpdate"] = "Failed to update user data";
    NotificationMessage["userWithCurrentNameAlreadyExist"] = "The user with the current username is already registered";
    NotificationMessage["userWithCurrentEmailAlreadyExist"] = "The user with the current email address is already registered";
    NotificationMessage["failedPassHash"] = "Password hashing failed";
    NotificationMessage["failedSendConfirmEmail"] = "Failed to send confirmation email";
    NotificationMessage["exhaustedConfirmationAttempts"] = "Attempts to send confirmation the link ended =(";
    NotificationMessage["userNotFound"] = "User not found";
    NotificationMessage["wrongPass"] = "Invalid password";
    NotificationMessage["failedEmailConfirm"] = "Email confirm failed";
    NotificationMessage["emailNotConfirm"] = "Please, confirm email";
    NotificationMessage["usersFind"] = "Error while finding user(s)";
    NotificationMessage["failedUpdateSettings"] = "Failed to save user settings";
    NotificationMessage["emailLinkedToAnotherMethod"] = "This email is already linked to another login method";
    NotificationMessage["failedFindEmail"] = "Could not find the current email address";
    NotificationMessage["nextTimeRequestNotPossible"] = "The code was sent earlier";
    NotificationMessage["noFilesExist"] = "No files exist";
    NotificationMessage["notImage"] = "File is not an image";
    NotificationMessage["failedSendConfirmationLink"] = "Failed to send confirmation link, please try later";
    NotificationMessage["couldNotFindEmail"] = "Could not find the current email address";
    NotificationMessage["imageConverterError"] = "Server could not process the image, please choose another image file";
    NotificationMessage["failedToLogin"] = "Login failed, server error. Please try again, later";
    NotificationMessage["imageResNotAllowed"] = "Image resolution not allowed";
    NotificationMessage["tokenExpired"] = "Token expired";
    NotificationMessage["authenticationError"] = "Authentication error";
    NotificationMessage["maxAttachedFilesExceed"] = "The maximum number of attached images should not exceed 4";
    NotificationMessage["imageSizeMustLessThan2mb"] = "Image size must be less than 2mb";
})(NotificationMessage = exports.NotificationMessage || (exports.NotificationMessage = {}));
// !for every endpoints use upper snake case!
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
    RouteNames["PRIVACY_POLICY"] = "/privacy-policy/";
    // Don't forget to change path below in nginx manually
    RouteNames["SOCKET_PATH"] = "/app-socket/";
    RouteNames["API"] = "/api/";
})(RouteNames = exports.RouteNames || (exports.RouteNames = {}));
var SocketActions;
(function (SocketActions) {
    SocketActions["CONNECTION"] = "connection";
    SocketActions["ERROR"] = "error";
    SocketActions["RECONNECT"] = "reconnect";
    SocketActions["AUTH_ERROR"] = "auth-error";
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
    SocketActions["CALLS_UPDATED"] = "calls-updated";
    SocketActions["CALL_UPDATED"] = "call-updated";
    SocketActions["MARK_CALL_AS_VIDEO"] = "mark-call-as-video";
    SocketActions["UPDATE_CALL_SIGNAL"] = "update-call-signal";
    SocketActions["INTERLOCUTOR_UPDATE_SIGNAL"] = "interlocutor-update-signal";
    // Socket.io events
    SocketActions["RECONNECT_ATTEMPT"] = "reconnect_attempt";
    SocketActions["RECONNECT_FAILED"] = "reconnect_failed";
})(SocketActions = exports.SocketActions || (exports.SocketActions = {}));
var AuthTokens;
(function (AuthTokens) {
    AuthTokens["accessToken"] = "jwt";
    AuthTokens["refreshToken"] = "refresh-jwt";
})(AuthTokens = exports.AuthTokens || (exports.AuthTokens = {}));
