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
        name: "todSkip",
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
        const requiredConfirmers = Math.floor(
            (await interaction.client.sequelize.models.player.count({
                where: {
                    active: true,
                },
            })) / 2
        );

        if (qGiver.get("id") != interaction.user.id) {
            await interaction.reply({
                content: `You can't skip, ${userMention(
                    qGiver.get("id")
                )} has to make this decision.`,
                ephemeral: true,
            });
        } else {
            if (qGiver.get("skips") > 0) {
                // update playerdatabase with the new skipcount of player
                interaction.client.sequelize.models.player.update(
                    {
                        skips: qGiver.get("skips") - 1,
                    },
                    {
                        where: {
                            id: qGiver.get("id"),
                        },
                    }
                );
                // declare buttons
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
                const skipOrComfirm = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("todConfirm")
                        .setLabel(
                            `Confirm [${aktSession.get(
                                "confirmed"
                            )}/${requiredConfirmers}]`
                        )
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId("todSkip")
                        .setLabel(
                            `Skip [${qGiver.get("skips") - 1}/${aktSession.get(
                                "skips"
                            )}]`
                        )
                        .setStyle(ButtonStyle.Success)
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
                let [qTaker] = await interaction.client.sequelize.query(
                    "SELECT `id` FROM `player` WHERE `active` ORDER BY RANDOM() LIMIT 1",
                    {
                        type: QueryTypes.SELECT,
                    }
                );

                while (qGiver.get("id") == Object.values(qTaker).toString()) {
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
                        qGiver: qGiver.get("id"),
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
                            qGiver.get("id")
                        )} says in a threatening voice: Truth or Dare, ${userMention(
                            Object.values(qTaker).toString()
                        )}?`
                    );

                message.edit({ components: [skipOrComfirm] });

                await interaction.reply(
                    `${userMention(
                        qGiver.get("id")
                    )} is skipping! Sometimes Truth or Dare is just too hot too handle ;)`
                );
                const newMessage = await interaction.followUp(
                    `Determining a new Victim...`
                );
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
                await interaction.reply({
                    content: `You coward don't have any skips left. You can't run now! \n (But if you are seriously uncomfortable with this dare/question, consider talking to your friends about it, if they are good friends, they'll understand.)`,
                    ephemeral: true,
                });
            }
        }
    },
};
