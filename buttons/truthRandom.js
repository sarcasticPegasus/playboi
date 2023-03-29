const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");
const dare = require("../database/models/dare");
const truth = require("../database/models/truth");

module.exports = {
    data: {
        name: "truthRandom",
    },

    async execute(interaction) {
        const message = interaction.message;
        const rows = await interaction.client.sequelize.models.truth.count();
        const rand = Math.floor(Math.random() * rows) + 1;
        const question =
            await interaction.client.sequelize.models.truth.findOne({
                where: { id: rand },
            });
        const truthOrDare = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Truth or Dare")
            .setDescription(question.get("content"));
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
            await interaction.reply({
                embeds: [truthOrDare],
                components: [skipOrComfirm],
            });
        } else {
            console.log(`Could not find question with id: ${rand}`);
        }
    },
};
