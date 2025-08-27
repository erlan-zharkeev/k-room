"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.StatusEnum = void 0;
__exportStar(require("./shared-types"), exports);
var StatusEnum;
(function (StatusEnum) {
    StatusEnum[StatusEnum["Success"] = 200] = "Success";
    StatusEnum[StatusEnum["BadRequest"] = 400] = "BadRequest";
    StatusEnum[StatusEnum["NotAuth"] = 401] = "NotAuth";
    StatusEnum[StatusEnum["Forbidden"] = 403] = "Forbidden";
    StatusEnum[StatusEnum["NotFound"] = 404] = "NotFound";
    StatusEnum[StatusEnum["Server"] = 500] = "Server";
    StatusEnum[StatusEnum["Unreachable"] = 503] = "Unreachable";
    StatusEnum[StatusEnum["BadGateway"] = 504] = "BadGateway";
})(StatusEnum = exports.StatusEnum || (exports.StatusEnum = {}));
