export interface ICodes {
    passwordRecovery: {
        query: {
            value: string;
            expiresIn: string;
        };
        email: string;
        sms: string;
    };
    nextRequestPossibleAt: string;
}
export interface ICodeValidationPayload {
    email: string;
    code: string;
}
