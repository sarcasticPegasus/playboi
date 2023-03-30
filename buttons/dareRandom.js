const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");
const { QueryTypes } = require("sequelize");

module.exports = {
    data: {
        name: "dareRandom",
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
            const rows = await interaction.client.sequelize.models.dare.count();
            const rand = Math.floor(Math.random() * rows) + 1;
            const question =
                await interaction.client.sequelize.models.dare.findOne({
                    where: { id: rand },
                });
            const truthOrDare = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Truth or Dare")
                .setDescription(question.get("content"));
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
                    .setCustomId("confirm")
                    .setLabel("Confirm [X/X]")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("skip")
                    .setLabel("Skip [X/X]")
                    .setStyle(ButtonStyle.Primary)
            );
            if (question) {
                message.edit({
                    embeds: [truthOrDare],
                    components: [todButtons, skipOrComfirm],
                });
            } else {
                console.log(`Could not find task with id: ${rand}`);
            }
        }
    },
};
