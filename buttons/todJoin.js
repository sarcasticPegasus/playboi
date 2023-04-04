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
        name: "todJoin",
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

        // if a player was found, check wether the player is inactive, if yes, set to active, if not, reply that the user is already player
        if (!created) {
            const player =
                await interaction.client.sequelize.models.player.findOne({
                    where: { id: interaction.user.id, active: false },
                });
            if (player == null) {
                await interaction.reply({
                    content: `${interaction.user.username} you already joined this round of Truth or Dare...`,
                    ephemeral: true,
                });
            } else {
                await interaction.client.sequelize.models.player.update(
                    {
                        active: true,
                    },
                    {
                        where: {
                            id: interaction.user.id,
                        },
                    }
                );
                await interaction.reply(
                    `${interaction.user.username} joined the round!`
                );
            }
        } else {
            await interaction.reply(
                `${interaction.user.username} joined the round!`
            );
        }
    },
};
