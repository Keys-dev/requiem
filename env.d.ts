declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string
            MONGO_URI: string

            GUILD_ID: string
            CLIENT_ID: string

            PREFIX: string
        }
    }
}
 
export {}