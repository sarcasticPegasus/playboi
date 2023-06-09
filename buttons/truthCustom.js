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
        name: "truthCustom",
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
            const origMessage = interaction.message;
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
            const custOrRand = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("truthCustom")
                    .setLabel("Custom")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("truthRandom")
                    .setLabel("Random")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );
            const awaitingReply = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Truth")
                .setDescription(
                    `${userMention(
                        interaction.user.id
                    )} is determining a question.`
                );

            interaction.user.send(
                "Please send me your custom question! You have 5 minutes, then I'll choose a random question."
            );
            origMessage.edit({ components: [custOrRand] });
            await interaction
                .reply({
                    embeds: [awaitingReply],
                    components: [todButtons],
                    fetchReply: true,
                })
                .then(async () => {
                    const message = await interaction.fetchReply();
                    const filter = (m) => interaction.user.id === m.author.id;
                    const channel = await interaction.user.dmChannel;
                    await channel
                        .awaitMessages({
                            filter,
                            time: 300000,
                            max: 1,
                            errors: ["time"],
                        })
                        .then(async (messages) => {
                            const truthOrDare = new EmbedBuilder()
                                .setColor(0x0099ff)
                                .setTitle("Truth")
                                .setDescription(
                                    `${userMention(qTaker.get("id"))}: \n${
                                        messages.first().content
                                    }`
                                )
                                .setFooter({
                                    text: `question by ${interaction.user.username}`,
                                });
                            message.edit({
                                embeds: [truthOrDare],
                                components: [todButtons, skipOrComfirm],
                            });
                        })
                        .catch(async () => {
                            const rows =
                                await interaction.client.sequelize.models.truth.count();
                            const rand = Math.floor(Math.random() * rows) + 1;
                            const question =
                                await interaction.client.sequelize.models.truth.findOne(
                                    {
                                        where: { id: rand },
                                    }
                                );
                            const truthOrDare = new EmbedBuilder()
                                .setColor(0x0099ff)
                                .setTitle("Truth")
                                .setDescription(
                                    `${userMention(
                                        interaction.user.id
                                    )} was to slow, so now you get a random question: \n \n ${userMention(
                                        qTaker.get("id")
                                    )}: \n ${question.get("content")}`
                                )
                                .setFooter({
                                    text: `question by ${interaction.user.username}`,
                                });
                            message.edit({
                                embeds: [truthOrDare],
                                components: [todButtons, skipOrComfirm],
                            });
                        });
                });
        }
    },
};
