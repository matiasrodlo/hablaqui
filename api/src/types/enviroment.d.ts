declare global {
    namespace NodeJS {
        interface ProcessEnv {
            URLDB: string;
            NODE_ENV: 'development' | 'production';
            PORT: string;
            VUE_APP_ORIGIN: string;
            FRONTEND_URL: string;
            JWT_SECRET: string;
            JWT_ALGORITHM: string;
            JWT_EXPIRATION: string;
            JWT_EXPIRATION_REFRESH: string;
            JWT_SECRET_REFRESH: string;
            PASSWORD_RECOVERY_JWT_EXPIRATION: string;
            API_URL: string;
            BUCKETNAME: string;
            MERCADOPAGO_KEY: string;
            NO_REPLY_EMAIL: string;
            NO_REPLY_PASSWORD: string;
            SEGMENT_API_KEY: string;
            SENDGRID_API_KEY: string;
            VUE_APP_LANDING: string;
            KEY_API_TESTMAILS: string;
            NAMESPACE_TESTMAILS: string;
        }
    }
}
export {};