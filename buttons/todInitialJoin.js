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
        name: "todInitialJoin",
    },
    async execute(interaction) {
        // calculates the average skips players have left in the game
        const skips = Math.round(
            (await interaction.client.sequelize.models.player.sum("skips")) /
                (await interaction.client.sequelize.models.player.count())
        );

        // tries to find player by user id, return this player with newPlayer. If no player can be found a new one is created
        const [newPlayer, created] =
            await interaction.client.sequelize.models.player.findOrCreate({
                where: { id: interaction.user.id },
                defaults: {
                    id: interaction.user.id,
                    username: interaction.user.username,
                    skips: skips,
                    hasConfirmed: false,
                    active: true,
                },
            });

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
                "SELECT `id` FROM `player` WHERE `active`",
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

            const truthOrDare = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Truth or Dare")
                .setDescription(
                    `@everyone , gather round for an epic round of Truth or Dare!`
                )
                .addFields({
                    name: "The Players are:",
                    value: aktPlayersString,
                })
                .addFields({
                    name: "Numbers of Skips:",
                    value: `You all start with ${skips} skips`,
                });
            message.edit({ embeds: [truthOrDare] });

            await interaction.reply(
                `${interaction.user.username} joined the round!`
            );
        }
    },
};
