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
        name: "wyrB",
    },
    async execute(interaction) {
        const message = interaction.message;
        await interaction.reply({
            content: `${interaction.user.username} you voted B! Great!`,
            ephemeral: true,
        });
        const embed = message.embeds[0];
        const fieldEither = embed.fields[0];
        const fieldOr = embed.fields[1];
        if (fieldOr.value.length == 1) {
            fieldOr.value = `\n- ${userMention(interaction.user.id)}`;
        } else if (
            !fieldOr.value.includes(`- ${userMention(interaction.user.id)}`)
        ) {
            fieldOr.value += `\n- ${userMention(interaction.user.id)}`;
        }
        fieldEither.value.replace(`- <@${interaction.user.id}>`, ``);
        const finalEmbed = EmbedBuilder.from(embed).setFields(
            fieldEither,
            fieldOr
        );
        message.edit({ embeds: [finalEmbed] });
    },
};
