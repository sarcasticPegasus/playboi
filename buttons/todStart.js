const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    userMention,
} = require("discord.js");
const { QueryTypes } = require("sequelize");

module.exports = {
    data: {
        name: "todStart",
    },
    async execute(interaction) {
        // looks whether enough players start, if not the players are told this.
        const playerCount =
            await interaction.client.sequelize.models.player.count({
                where: {
                    active: true,
                },
            });
        if (playerCount <= 1) {
            await interaction.reply({
                content: `Sorry, this game can't be played alone... You will need to wait for more players.`,
                ephemeral: true,
            });
        } else {
            const message = interaction.message;

            // declare buttons
            const todButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("todLeave")
                    .setLabel("Leave")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("todEnd")
                    .setLabel("End")
                    .setStyle(ButtonStyle.Danger)
            );
            const startOrJoin = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("todJoin")
                    .setLabel("Join")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("todChoose")
                    .setLabel("Start")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );
            const truthOrDareButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("truthTod")
                    .setLabel("Truth")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("dareTod")
                    .setLabel("Dare")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("randomTod")
                    .setLabel("Random")
                    .setStyle(ButtonStyle.Primary)
            );

            // determine the question giver and question answerer
            const [qGiver] = await interaction.client.sequelize.query(
                "SELECT `id` FROM `player` WHERE `active` ORDER BY RANDOM() LIMIT 1",
                {
                    type: QueryTypes.SELECT,
                }
            );

            let [qTaker] = await interaction.client.sequelize.query(
                "SELECT `id` FROM `player` WHERE `active` ORDER BY RANDOM() LIMIT 1",
                {
                    type: QueryTypes.SELECT,
                }
            );

            while (
                Object.values(qGiver).toString() ==
                Object.values(qTaker).toString()
            ) {
                [qTaker] = await interaction.client.sequelize.query(
                    "SELECT `id` FROM `player` WHERE `active` ORDER BY RANDOM() LIMIT 1",
                    {
                        type: QueryTypes.SELECT,
                    }
                );
            }

            // save question giver and question answerer to the database
            interaction.client.sequelize.models.todSession.update(
                {
                    qGiver: Object.values(qGiver).toString(),
                    qTaker: Object.values(qTaker).toString(),
                },
                {
                    where: {
                        id: 1,
                    },
                }
            );

            // declare embed
            const truthOrDare = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Truth or Dare")
                .setDescription(
                    `${userMention(
                        Object.values(qGiver).toString()
                    )} says in a threatening voice: Truth or Dare, ${userMention(
                        Object.values(qTaker).toString()
                    )}?`
                );

            message.edit({ components: [startOrJoin] });

            await interaction.reply({
                embeds: [truthOrDare],
                components: [todButtons, truthOrDareButtons],
            });
        }
    },
};
