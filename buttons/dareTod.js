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
        name: "dareTod",
    },

    async execute(interaction) {
        const [qGiver] = await interaction.client.sequelize.query(
            "SELECT `qGiver` FROM `todSession`",
            {
                type: QueryTypes.SELECT,
            }
        );
        const [qTaker] = await interaction.client.sequelize.query(
            "SELECT `qTaker` FROM `todSession`",
            {
                type: QueryTypes.SELECT,
            }
        );

        if (Object.values(qTaker).toString() != interaction.user.id) {
            await interaction.reply({
                content: `You don't get to decide here!`,
                ephemeral: true,
            });
        } else {
            const message = interaction.message;

            const todButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("todJoin")
                    .setLabel("Join")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("todLeave")
                    .setLabel("Leave")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("todEnd")
                    .setLabel("End")
                    .setStyle(ButtonStyle.Danger)
            );

            const truthOrDare = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Dare")
                .setDescription(
                    `${userMention(
                        Object.values(qGiver).toString()
                    )}, do you want to dare ${userMention(
                        Object.values(qTaker).toString()
                    )} to do a custom or a random task?`
                );

            const truthOrDareButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("truthTod")
                    .setLabel("Truth")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("dareTod")
                    .setLabel("Dare")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("randomTod")
                    .setLabel("Random")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );

            const custOrRand = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("dareCustom")
                    .setLabel("Custom")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("dareRandom")
                    .setLabel("Random")
                    .setStyle(ButtonStyle.Primary)
            );

            message.edit({ components: [truthOrDareButtons] });

            await interaction.reply({
                embeds: [truthOrDare],
                components: [todButtons, custOrRand],
            });
        }
    },
};
