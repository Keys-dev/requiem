import { Command } from '../../structs/Command'
import { RequiemClient } from '../../structs/RequiemClient'
import { EmbedBuilder, time } from 'discord.js'

export default {
	name: 'status', category: 'information',
	description: 'Provides an embed of the bots current status.',
	async execute(client, message, args, content) {
		let sent = await message.reply({ embeds: [new EmbedBuilder().setDescription('Pinging...').toJSON()], })

		let embed = new EmbedBuilder()
			.setColor(RequiemClient.EMBED_COLOR)
			.addFields(
				{
					name: 'Ping', inline: true,
					value: `API: \`${client.ws.ping} ms\`\nBot: \`${sent.createdTimestamp - message.createdTimestamp} ms\``
				},
				{
					name: 'Uptime', inline: true,
					value: time(client.readyAt, 'R')
				}
			)

		await sent.edit({ embeds: [embed.toJSON()] })

		return
	}
} as Command