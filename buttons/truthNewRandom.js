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
        name: "truthNewRandom",
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

        if (qGiver.get("id") != interaction.user.id) {
            await interaction.reply({
                content: `You don't get to ask questions here!`,
                ephemeral: true,
            });
        } else {
            // if anyone has already confirmed to an old question, this is set back here
            interaction.client.sequelize.models.todSession.update(
                {
                    confirmed: 0,
                },
                {
                    where: {
                        id: 1,
                    },
                }
            );
            interaction.client.sequelize.models.player.update(
                {
                    hasConfirmed: false,
                },
                {
                    where: {
                        hasConfirmed: true,
                    },
                }
            );
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
                    `${userMention(qTaker.get("id"))}: \n${question.get(
                        "content"
                    )}`
                )
                .setFooter({
                    text: `question by ${interaction.user.username}`,
                });
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
            //determining how many skips are left
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
                        `Skip [${qTaker.get("skips")}/${aktSession.get(
                            "skips"
                        )}]`
                    )
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("truthNewRandom")
                    .setLabel(`new question`)
                    .setStyle(ButtonStyle.Primary)
            );
            message.edit({
                embeds: [truthOrDare],
                components: [todButtons, skipOrComfirm],
            });
            await interaction.reply(
                `${userMention(
                    interaction.user.id
                )} has choosen a different truth.`
            );
        }
    },
};
