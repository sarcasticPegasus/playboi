const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    userMention,
    EmbedBuilder,
} = require("discord.js");
const { QueryTypes } = require("sequelize");

module.exports = {
    data: {
        name: "todEnd",
    },
    async execute(interaction) {
        const message = interaction.message;
        await interaction.client.sequelize.models.todSession.destroy({
            truncate: true,
        });
        await interaction.client.sequelize.models.player.destroy({
            truncate: true,
        });
        message.edit({ components: [] });
        await interaction.reply(
            `${interaction.user.username} has ended this round of Truth or Dare...`
        );
    },
};
