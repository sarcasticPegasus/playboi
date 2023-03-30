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
        name: "todLeave",
    },
    async execute(interaction) {
        // CatchError: interaction.user is not part of the active players
        const actPlayers = await interaction.client.sequelize.query(
            "SELECT `id` FROM `player` WHERE `active`",
            {
                type: QueryTypes.SELECT,
            }
        );
        let foundPlayer = false;
        const iterator = actPlayers.values();
        for (const value of iterator) {
            if (Object.values(value).toString() == interaction.user.id) {
                foundPlayer = true;
            }
        }
        if (foundPlayer) {
            // interaction.user is set to inactive within database player
            interaction.client.sequelize.models.player.update(
                {
                    active: false,
                },
                {
                    where: {
                        id: interaction.user.id,
                    },
                }
            );

            // looks whether enough players to play are left, if not the game is ended and the datatables cleared
            const playersRemaining =
                await interaction.client.sequelize.models.player.count({
                    where: {
                        active: true,
                    },
                });
            if (playersRemaining <= 1) {
                const message = interaction.message;
                await interaction.client.sequelize.models.todSession.destroy({
                    truncate: true,
                });
                await interaction.client.sequelize.models.player.destroy({
                    truncate: true,
                });
                message.edit({ components: [] });
                await interaction.reply(
                    `Sorry this game can't be played alone... Game ended.`
                );
            } else {
                // inital reply, notifing users, that interaction.user has ended the session
                await interaction.reply(
                    `${interaction.user.username} has left the game :c`
                );
            }
        } else {
            await interaction.reply({
                content: `${interaction.user.username}, you already left... are you stupid or something? `,
                ephemeral: true,
            });
        }
    },
};
