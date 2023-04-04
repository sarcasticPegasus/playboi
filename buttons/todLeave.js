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
        const aktSession =
            await interaction.client.sequelize.models.todSession.findOne({
                where: { id: 1 },
            });
        const qGiver = await interaction.client.sequelize.models.player.findOne(
            {
                where: { id: aktSession.get("qGiver") },
            }
        );
        const qTaker = await interaction.client.sequelize.models.player.findOne(
            {
                where: { id: aktSession.get("qTaker") },
            }
        );
        if (interaction.user.id == qGiver.get("id")) {
            await interaction.reply({
                content: `Please give a truth or dare and wait until it is confirmed or skipped.`,
                ephemeral: true,
            });
        } else if (interaction.user.id == qTaker.get("id")) {
            await interaction.reply({
                content: `Please first answer your question or do your dare (or skip) and make sure it's confirmed.`,
                ephemeral: true,
            });
        } else {
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
                    await interaction.client.sequelize.models.todSession.destroy(
                        {
                            truncate: true,
                        }
                    );
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
                    content: `${interaction.user.username}, you are not part of the game, why are you trying to leave? `,
                    ephemeral: true,
                });
            }
        }
    },
};
