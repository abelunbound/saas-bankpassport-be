
interface AppConfig {
    GMAIL_HOST: string
    GMAIL_PORT: string
    GMAIL_SENDER: string
    GMAIL_APP_PASSWORD: string
}

export default (): AppConfig => ({
    GMAIL_HOST: process.env.GMAIL_HOST,
    GMAIL_PORT: process.env.GMAIL_PORT,
    GMAIL_SENDER: process.env.GMAIL_SENDER,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD
});