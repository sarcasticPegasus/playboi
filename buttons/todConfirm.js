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
        name: "todConfirm",
    },
    async execute(interaction) {
        const message = interaction.message;

        //determining how many skips are left
        const aktSession =
            await interaction.client.sequelize.models.todSession.findOne({
                where: { id: 1 },
            });
        const qGiver = await interaction.client.sequelize.models.player.findOne(
            {
                where: { id: aktSession.get("qTaker") },
            }
        );
        const interactingPlayer =
            await interaction.client.sequelize.models.player.findOne({
                where: { id: interaction.user.id },
            });
        const requiredConfirmers = Math.floor(
            (await interaction.client.sequelize.models.player.count({
                where: {
                    active: true,
                },
            })) / 2
        );

        if (qGiver.get("id") == interaction.user.id) {
            await interaction.reply({
                content: `You can't confirm for yourself!`,
                ephemeral: true,
            });
        } else {
            if (interactingPlayer.get("hasConfirmed")) {
                await interaction.reply({
                    content: `You already confirmed, you can't confirm a second time.`,
                    ephemeral: true,
                });
            } else {
                interaction.client.sequelize.models.todSession.update(
                    {
                        confirmed: aktSession.get("confirmed") + 1,
                    },
                    {
                        where: {
                            id: 1,
                        },
                    }
                );
                interaction.client.sequelize.models.player.update(
                    {
                        hasConfirmed: true,
                    },
                    {
                        where: {
                            id: interaction.user.id,
                        },
                    }
                );
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
                if (aktSession.get("confirmed") + 1 >= requiredConfirmers) {
                    // declare buttons
                    const skipOrComfirm = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("todConfirm")
                            .setLabel(
                                `Confirm [${
                                    aktSession.get("confirmed") + 1
                                }/${requiredConfirmers}]`
                            )
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId("todSkip")
                            .setLabel(
                                `Skip [${qGiver.get("skips")}/${aktSession.get(
                                    "skips"
                                )}]`
                            )
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    );
                    const truthOrDareButtons =
                        new ActionRowBuilder().addComponents(
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
                    let [qTaker] = await interaction.client.sequelize.query(
                        "SELECT `id` FROM `player` WHERE `active` ORDER BY RANDOM() LIMIT 1",
                        {
                            type: QueryTypes.SELECT,
                        }
                    );

                    while (
                        qGiver.get("id") == Object.values(qTaker).toString()
                    ) {
                        [qTaker] = await interaction.client.sequelize.query(
                            "SELECT `id` FROM `player` WHERE `active` ORDER BY RANDOM() LIMIT 1",
                            {
                                type: QueryTypes.SELECT,
                            }
                        );
                    }

                    // update todSession with the new question giver and taker
                    interaction.client.sequelize.models.todSession.update(
                        {
                            confirmed: 0,
                            qGiver: qGiver.get("id"),
                            qTaker: Object.values(qTaker).toString(),
                        },
                        {
                            where: {
                                id: 1,
                            },
                        }
                    );

                    // update all players and set their hasConfirmed status to false
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

                    // declare embed
                    const truthOrDare = new EmbedBuilder()
                        .setColor(0x0099ff)
                        .setTitle("Truth or Dare")
                        .setDescription(
                            `${userMention(
                                qGiver.get("id")
                            )} says in a threatening voice: Truth or Dare, ${userMention(
                                Object.values(qTaker).toString()
                            )}?`
                        );

                    message.edit({ components: [skipOrComfirm] });

                    await interaction.reply(`Determining a new Victim...`);
                    const newMessage = await interaction.fetchReply();
                    const wait = require("node:timers/promises").setTimeout;
                    await wait(3000);
                    newMessage.edit(
                        `The bottle points to ${userMention(
                            Object.values(qTaker).toString()
                        )}!`
                    );
                    await interaction.followUp({
                        embeds: [truthOrDare],
                        components: [todButtons, truthOrDareButtons],
                    });
                } else {
                    const skipOrComfirm = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("todConfirm")
                            .setLabel(
                                `Confirm [${aktSession.get(
                                    "confirmed"
                                )}/${requiredConfirmers}]`
                            )
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("skip")
                            .setLabel(
                                `Skip [${qGiver.get("skips")}/${aktSession.get(
                                    "skips"
                                )}]`
                            )
                            .setStyle(ButtonStyle.Primary)
                    );
                    message.edit({ components: [todButtons, skipOrComfirm] });
                    await interaction.reply({
                        content: `Thanks for confirming!`,
                        ephemeral: true,
                    });
                }
            }
        }
    },
};
