const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");
const { QueryTypes } = require("sequelize");

module.exports = {
    data: {
        name: "todChoose",
    },
    async execute(interaction) {
        const message = interaction.message;
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
        const truthOrDare = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Truth or Dare")
            .setDescription("Truth or Dare, @player?");

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
            Object.values(qGiver).toString() == Object.values(qTaker).toString()
        ) {
            [qTaker] = await interaction.client.sequelize.query(
                "SELECT `id` FROM `player` WHERE `active` ORDER BY RANDOM() LIMIT 1",
                {
                    type: QueryTypes.SELECT,
                }
            );
        }

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

        message.edit({ components: [startOrJoin] });

        await interaction.reply({
            embeds: [truthOrDare],
            components: [todButtons, truthOrDareButtons],
        });
    },
};
