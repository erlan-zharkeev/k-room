export interface IEnvVariables {
    APP_HOST: string;
    API_HOST: string;
    MONGO_ADMIN_HOST: string;
    MONGO_HOST: string;
    MONGO_ADMIN_MONGODB_URL: string;
    MONGO_ADMIN_USERNAME: string;
    MONGO_ADMIN_PASSWORD: string;
    COOKIE_DOMAIN: string;
    SENTRY_ENVIRONMENT: string;
    SENTRY_ENABLED: string;
    FIREBASE_API_KEY: string;
    RESEND_API_KEY: string;
    K_ROOM_ACCESS_TOKEN_SECRET: string;
    K_ROOM_REFRESH_TOKEN_SECRET: string;
    EMAIL_CONFIRM_SECRET: string;
}
export interface IEnvCommonVariables {
    SERVER_PORT: string;
    CLIENT_PORT: string;
    SOCKET_PATH: string;
    API_PATH: string;
}
