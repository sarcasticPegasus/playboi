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
        name: "truthCustom",
    },
    async execute(interaction) {
        //interaction.user.send(
        //    "Please send me your custom question! You have 5 minutes, then I'll choose a random question."
        //);
        await interaction
            .reply({
                content: `${userMention(
                    interaction.user.id
                )} is determining a question.`,
                fetchReply: true,
            })
            .then(async () => {
                const filter = (m) => interaction.user.id === m.author.id;
                const channel = await interaction.channel;
                await channel
                    .awaitMessages({
                        filter,
                        time: 30000,
                        max: 1,
                        errors: ["time"],
                    })
                    .then(async (messages) => {
                        await interaction.followUp(
                            `${messages.first().content}`
                        );
                    })
                    .catch(async () => {
                        await interaction.followUp(
                            "Insert random question here."
                        );
                    });
            });
    },
};
