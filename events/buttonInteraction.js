const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isButton()) return;

		const { buttons } = interaction.client;
		const { customId } = interaction;
		const button = buttons.get(customId);

		if (!button) {
			console.error(`No button matching ${interaction.buttonName} was found.`);
			return;
		}

		try {
			await button.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.buttonName}`);
			console.error(error);
		}
	},
};
