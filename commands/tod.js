const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    userMention,
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

        /*const selectRating = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("selectRating")
                .setPlaceholder("Nothing selected")
                .setMinValues(1)
                .setMaxValues(4)
                .addOptions(
                    {
                        label: "0+",
                        description:
                            "get questions or dares with rating 0+ or higher",
                        value: "first_option",
                    },
                    {
                        label: "12+",
                        description:
                            "get questions and dares with rating 12+ or higher",
                        value: "second_option",
                    },
                    {
                        label: "16+",
                        description:
                            "get questions and dares with rating 16+ or higher",
                        value: "second_option",
                    },
                    {
                        label: "18+",
                        description: "get questions and dares with rating 18+",
                        value: "second_option",
                    }
                )
        );
        */
        const startOrJoin = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("todInitialJoin")
                .setLabel("Join")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("todStart")
                .setLabel("Start")
                .setStyle(ButtonStyle.Primary)
        );
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
        const truthOrDare = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Truth or Dare")
            .setDescription(
                `@everyone gather round for an epic round of Truth or Dare!`
            )
            .addFields({
                name: "The Players are:",
                value: `${userMention(interaction.user.id)}`,
            })
            .addFields({
                name: "Numbers of Skips:",
                value: `You all start with ${skips} skips`,
            });

        interaction.client.sequelize.models.todSession.upsert({
            id: 1,
            skips: skips,
            confirmed: 0,
            qGiver: null,
            qTaker: null,
        });

        interaction.client.sequelize.models.player.upsert({
            id: interaction.user.id,
            username: interaction.user.username,
            skips: skips,
            hasConfirmed: false,
            active: true,
        });

        await interaction.reply({
            embeds: [truthOrDare],
            components: [todButtons, startOrJoin],
        });
    },
};
