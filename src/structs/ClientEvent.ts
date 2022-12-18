import { ClientEvents } from 'discord.js'
import { RequiemClient } from './RequiemClient'

export interface ClientEvent<K extends keyof ClientEvents> {
    readonly once?: boolean
    readonly name: K

    emit(client: RequiemClient, ...args: ClientEvents[K]): any
}