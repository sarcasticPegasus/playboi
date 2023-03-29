const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: {
        name: "todChoose",
    },
    async execute(interaction) {
        const todButtons = new ActionRowBuilder().addComponents(
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
        const truthOrDare = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Truth or Dare")
            .setDescription("Truth or Dare, @player?");

        await interaction.reply({
            embeds: [truthOrDare],
            components: [todButtons],
        });
    },
};
