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
        name: "truthRandom",
    },

    async execute(interaction) {
        const [qGiver] = await interaction.client.sequelize.query(
            "SELECT `qGiver` FROM `todSession`",
            {
                type: QueryTypes.SELECT,
            }
        );

        if (Object.values(qGiver).toString() != interaction.user.id) {
            await interaction.reply({
                content: `You don't get to ask questions here!`,
                ephemeral: true,
            });
        } else {
            const message = interaction.message;
            const rows =
                await interaction.client.sequelize.models.truth.count();
            const rand = Math.floor(Math.random() * rows) + 1;
            const question =
                await interaction.client.sequelize.models.truth.findOne({
                    where: { id: rand },
                });
            const truthOrDare = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Truth")
                .setDescription(
                    `**${question.get(
                        "content"
                    )}** \n question by ${userMention(
                        interaction.client.user.id
                    )}`
                );
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
            //determining how many skips are left
            const aktSession =
                await interaction.client.sequelize.models.todSession.findOne({
                    where: { id: 1 },
                });
            const qGiver =
                await interaction.client.sequelize.models.player.findOne({
                    where: { id: aktSession.get("qTaker") },
                });
            const requiredConfirmers = Math.floor(
                (await interaction.client.sequelize.models.player.count({
                    where: {
                        active: true,
                    },
                })) / 2
            );
            const skipOrComfirm = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("todConfirm")
                    .setLabel(`Confirm [0/${requiredConfirmers}]`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("todSkip")
                    .setLabel(
                        `Skip [${qGiver.get("skips")}/${aktSession.get(
                            "skips"
                        )}]`
                    )
                    .setStyle(ButtonStyle.Primary)
            );
            const custOrRand = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("truthCustom")
                    .setLabel("Custom")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("truthRandom")
                    .setLabel("Random")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
            );
            //if (question) {
            message.edit({ components: [custOrRand] });
            await interaction.reply({
                embeds: [truthOrDare],
                components: [todButtons, skipOrComfirm],
            });
            //} else {
            //    await interaction.reply(
            //        `Could not find question with id: ${rand}`
            //    );
            //}
        }
    },
};
