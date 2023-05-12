const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    userMention,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wizard")
        .setDescription("starts a wizard session"),
    async execute(interaction) {
        const startOrJoin = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("wizardInitialJoin")
                .setLabel("Join")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("wizardStart")
                .setLabel("Start")
                .setStyle(ButtonStyle.Primary)
        );
        const wizard = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Wizard")
            .setDescription(
                "Someone has started a game of wizard. If you want to join the fun, click join!"
            )
            .addFields({
                name: "The Players are:",
                value: `${userMention(interaction.user.id)}`,
            });

        interaction.client.sequelize.models.wizardPlayer.upsert({
            id: interaction.user.id,
            active: true,
        });

        await interaction.reply({
            embeds: [wizard],
            components: [startOrJoin],
        });
    },
};
