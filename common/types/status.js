export var StatusEnum;
(function (StatusEnum) {
    StatusEnum[StatusEnum["Success"] = 200] = "Success";
    StatusEnum[StatusEnum["BadRequest"] = 400] = "BadRequest";
    StatusEnum[StatusEnum["NotAuth"] = 401] = "NotAuth";
    StatusEnum[StatusEnum["Forbidden"] = 403] = "Forbidden";
    StatusEnum[StatusEnum["NotFound"] = 404] = "NotFound";
    StatusEnum[StatusEnum["Server"] = 500] = "Server";
    StatusEnum[StatusEnum["Unreachable"] = 503] = "Unreachable";
    StatusEnum[StatusEnum["BadGateway"] = 504] = "BadGateway";
})(StatusEnum || (StatusEnum = {}));
