import {RequiemClient} from './RequiemClient'
import {
    Message,
    PermissionResolvable, RESTPostAPIApplicationCommandsJSONBody,
} from 'discord.js'

export interface Command {
    readonly name: string
    readonly category: string
    readonly description: string

    guildOnly?: boolean

    memberPerms?: PermissionResolvable
    botPerms?: PermissionResolvable

    execute(client: RequiemClient, message: Message, args: string[], content: string): Promise<string | undefined | null>
}
