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
        const skips = Math.round(
            (await interaction.client.sequelize.models.player.sum("skips")) /
                (await interaction.client.sequelize.models.player.count())
        );

        const [newPlayer, created] =
            await interaction.client.sequelize.models.player.findOrCreate({
                where: { id: interaction.user.id },
                defaults: {
                    id: interaction.user.id,
                    username: interaction.user.username,
                    skips: skips,
                    active: true,
                },
            });

        if (!created) {
            await interaction.reply({
                content: `${interaction.user.username} you already joined this round of Truth or Dare...`,
                ephemeral: true,
            });
        } else {
            const message = interaction.message;

            const aktPlayers = await interaction.client.sequelize.query(
                "SELECT `id` FROM `player`",
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
                `${interaction.user.username} joined the session!`
            );
        }
    },
};
