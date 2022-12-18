import { ClientEvent } from '../../structs/ClientEvent'
import { RequiemClient } from '../../structs/RequiemClient'
import { Logger } from '../../util/Logger'

export default {
	name: 'messageCreate',

	async emit(client, message): Promise<any> {
		if (!message.content.startsWith(RequiemClient.PREFIX) || message.author.bot) return

		let [cmd, ...args] = message.content.slice(RequiemClient.PREFIX.length)
			.trim().split(/ +/)
		let content = message.content.slice(RequiemClient.PREFIX.length + cmd.length + 1)

		let command = client.commands.get(cmd.toLowerCase())

		if (!command) return await message.reply({ content: `Command \`${cmd.toLowerCase()}\` does not exist.` })

		if (command.guildOnly && !message.inGuild()) return await message.reply({ content: 'This command is guild-only.' })

		try {
			await command.execute(client, message, args, content)
		} catch (error) {
			Logger.error('Error trying to execute command:', error)
		}
	}
} as ClientEvent<'messageCreate'>