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
        const [actPlayers] = await interaction.client.sequelize.query(
            "SELECT `id` FROM `player` WHERE `active`",
            {
                type: QueryTypes.SELECT,
            }
        );
        console.log(actPlayers);

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

        // inital reply, notifing users, that interaction.user has ended the session
        await interaction.reply(`${interaction.user.username} has left `);
    },
};
