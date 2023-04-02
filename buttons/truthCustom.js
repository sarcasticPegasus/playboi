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
            const origMessage = interaction.message;
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
            const skipOrComfirm = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("todConfirm")
                    .setLabel("Confirm [X/X]")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("todSkip")
                    .setLabel("Skip [X/X]")
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
                            time: 30000,
                            max: 1,
                            errors: ["time"],
                        })
                        .then(async (messages) => {
                            const truthOrDare = new EmbedBuilder()
                                .setColor(0x0099ff)
                                .setTitle("Truth")
                                .setDescription(
                                    `**${
                                        messages.first().content
                                    }** \n question by ${userMention(
                                        interaction.user.id
                                    )}`
                                );
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
                                    )} was to slow, so now you get a random question: \n **${question.get(
                                        "content"
                                    )}**`
                                );
                            message.edit({
                                embeds: [truthOrDare],
                                components: [todButtons, skipOrComfirm],
                            });
                        });
                });
        }
    },
};
