const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: {
        name: "truthTod",
    },

    async execute(interaction) {
        const message = interaction.message;

        const truthOrDare = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Truth or Dare")
            .setDescription(
                "@player1, do you want to ask @player2 a custom or a random question? (You can press random up to 3 times if you are not satisfied with the first random question.)"
            );

        const custOrRand = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("truthCustom")
                .setLabel("Custom")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("truthRandom")
                .setLabel("Random")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [truthOrDare],
            components: [custOrRand],
        });
    },
};
