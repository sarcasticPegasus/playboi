const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tod")
        .setDescription("Initializes a game of Truth or Dare.")
        .addIntegerOption((option) =>
            option
                .setName("skips")
                .setDescription(
                    "The number of skips everyone should have in this session. Default: Zero"
                )
                .setRequired(false)
        ),
    async execute(interaction) {
        const skips = interaction.options.getInteger("skips") ?? 0;

        const todButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("todJoin")
                .setLabel("Join")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("todChoose")
                .setLabel("Start")
                .setStyle(ButtonStyle.Primary)
        );
        const truthOrDare = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Truth or Dare")
            .setDescription(
                `@everyone , gather round for an epic round of Truth or Dare!`
            )
            .addFields({
                name: "The Players are:",
                value: `@${interaction.user.username}`,
            });

        interaction.client.sequelize.models.player.upsert({
            id: interaction.user.id,
            username: interaction.user.username,
            skips: skips,
            active: true,
        });

        await interaction.reply({
            embeds: [truthOrDare],
            components: [todButtons],
        });
    },
};
