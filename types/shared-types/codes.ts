export interface Codes {
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

export interface CodeValidationPayload {
  email: string;
  code: string;
}