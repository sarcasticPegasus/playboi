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
        name: "wizardInitialJoin",
    },
    async execute(interaction) {
        // tries to find player by user id, return this player with newPlayer. If no player can be found a new one is created
        const [newPlayer, created] =
            await interaction.client.sequelize.models.wizardPlayer.findOrCreate(
                {
                    where: { id: interaction.user.id },
                    defaults: {
                        id: interaction.user.id,
                        active: true,
                    },
                }
            );

        // if a player was found, reply that the user is already player
        if (!created) {
            await interaction.reply({
                content: `${interaction.user.username} you already joined this round of Truth or Dare...`,
                ephemeral: true,
            });
        } else {
            // if no player was found:
            const message = interaction.message;

            // saves all ids of players in aktPlayers
            const aktPlayers = await interaction.client.sequelize.query(
                "SELECT `id` FROM `wizardPlayer` WHERE `active`",
                {
                    type: QueryTypes.SELECT,
                }
            );
            let aktPlayersString = "";
            const iterator = aktPlayers.values();
            for (const value of iterator) {
                aktPlayersString += `${userMention(
                    Object.values(value).toString()
                )}\n`;
            }

            const wizard = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Wizard")
                .setDescription(
                    "Someone has started a game of wizard. If you want to join the fun, click join!"
                )
                .addFields({
                    name: "The Players are:",
                    value: aktPlayersString,
                });
            message.edit({ embeds: [wizard] });

            await interaction.reply(
                `${interaction.user.username} joined the round!`
            );
        }
    },
};
