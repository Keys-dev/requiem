import { ActivityType, Client as BaseClient, Collection, GatewayIntentBits, Partials } from 'discord.js'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { defaultImport } from '../util/Common'
import { Logger } from '../util/Logger'
import { ClientEvent } from './ClientEvent'
import { Command } from './Command'

export class RequiemClient extends BaseClient<true> {
    public static readonly EMBED_COLOR = 0x4DBDFF
    public static readonly PREFIX = process.env.PREFIX!

    public readonly commands = new Collection<string, Command>()

    public constructor () {
        super({
            intents: [
                GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages
            ],
            allowedMentions: { repliedUser: false },
            partials: [Partials.Message, Partials.Channel],
            presence: { 
                activities: [{ name: 'thug hunters...', type: ActivityType.Watching }]
            }
        })
    }

    private async registerEvents(eventsDir: string): Promise<void> {
        Logger.info('Registering client events...')

        let eventsPath = join(__dirname, '..', eventsDir)

        let eventFiles = (await readdir(eventsPath))
            .filter(file => file.endsWith('.js') || file.endsWith('.ts'))

        for (let file of eventFiles) {
            let filePath = join(eventsPath, file)
            let event = await defaultImport<ClientEvent<any>>(filePath)

            if (!Object.hasOwn(event, 'name')) {
                Logger.warn(`File ${file} does not export an event - skipped!`)

                continue
            }

            this[event.once ? 'once' : 'on'](event.name, event.emit.bind(null, this))

            Logger.info(`${event.name}: ${file} - registered!`)
        }

        Logger.info('RequiemClient events registered successfully!')
    }
    private async registerCommands(commandsDir: string): Promise<void> {
        Logger.info('Registering commands')

        let commandsPath = join(__dirname, '..', commandsDir)

        let categoryDirs = await readdir(commandsPath)

        for (let directory of categoryDirs) {
            let categoryPath = join(commandsPath, directory)
            let commandFiles = (await readdir(categoryPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'))

            for (let file of commandFiles) {
                let filePath = join(categoryPath, file)
                let command = await defaultImport<Command>(filePath)

                if (!Object.hasOwn(command, 'name')) {
                    Logger.warn(`File ${file} does not export a command - skipped!`)

                    continue
                }

                this.commands.set(command.name, command)

                Logger.info(`${command.category}: ${command.name} - registered!`)
            }
        }

        Logger.info('Commands registered successfully!')
    }

    public async start(): Promise<void> {
        await this.registerEvents('events/client')
        await this.registerCommands('commands')


        await this.login(process.env.BOT_TOKEN!)
    }
}