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
        name: "dareCustom",
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
                content: `You don't get to pick dares here!`,
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
                    .setCustomId("dareNewRandom")
                    .setLabel(`new dare`)
                    .setStyle(ButtonStyle.Primary)
            );
            const custOrRand = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("dareCustom")
                    .setLabel("Custom")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("dareRandom")
                    .setLabel("Random")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );
            const awaitingReply = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Dare")
                .setDescription(
                    `${userMention(interaction.user.id)} is determining a dare.`
                );

            interaction.user.send(
                "Please send me your custom dare! You have 5 minutes, then I'll choose a random dare."
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
                                .setTitle("Dare")
                                .setDescription(
                                    `${userMention(qTaker.get("id"))}:  **${
                                        messages.first().content
                                    }**`
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
                                await interaction.client.sequelize.models.dare.count();
                            const rand = Math.floor(Math.random() * rows) + 1;
                            const dare =
                                await interaction.client.sequelize.models.dare.findOne(
                                    {
                                        where: { id: rand },
                                    }
                                );
                            const truthOrDare = new EmbedBuilder()
                                .setColor(0x0099ff)
                                .setTitle("Dare")
                                .setDescription(
                                    `${userMention(
                                        interaction.user.id
                                    )} was to slow, so now you get a random dare: \n \n ${userMention(
                                        qTaker.get("id")
                                    )}:  **${dare.get("content")}**`
                                )
                                .setFooter({
                                    text: `dare by ${interaction.user.username}`,
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
