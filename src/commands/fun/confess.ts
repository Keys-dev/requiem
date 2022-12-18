import { codeBlock, EmbedBuilder } from 'discord.js'
import { Command } from '../../structs/Command'
import { RequiemClient } from '../../structs/RequiemClient'
import { Logger } from '../../util/Logger'

const CONF_CHAN = '586070670102888449'

export default {
	name: 'confess', category: 'fun',
	description: 'Confess, lol.',
	async execute(client, message, args, content) {
		if (!message.channel.isDMBased()) return await message.reply('Execute this command in DMs.')
		if (message.deletable) await message.delete()

		let channel = await client.channels.fetch(CONF_CHAN)

		if (!channel) return Logger.error('Channel not found.')
		if (!channel.isTextBased()) return Logger.error('Channel is not text-based.')

		let embed = new EmbedBuilder()
			.setColor(RequiemClient.EMBED_COLOR)
			.setTitle('Confession!').setDescription(content)
			.setFooter({ text: 'DM me ~confess to make a confession!' }).setTimestamp()
		try {
			await channel.send({ embeds: [embed.toJSON()] })
			await message.reply({ content: 'Your confession has been sent successfully!' })
		} catch (error) {
			await message.reply({ content: 'Your confession was not sent successfully...' })
		}
		return
	}
} as Command