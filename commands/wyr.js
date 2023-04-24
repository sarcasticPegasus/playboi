const { SlashCommandBuilder } = require("discord.js");
const wyr = require("../database/models/wyr");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wyr")
        .setDescription("Sends a random Would You Rather question."),
    async execute(interaction) {
        const rows = await interaction.client.sequelize.models.wyr.count();
        const rand = Math.floor(Math.random() * rows) + 1;
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const question = await interaction.client.sequelize.models.wyr.findOne({
            where: { id: rand },
        });

        if (question) {
            await interaction.reply(
                "Would you rather " +
                    question.get("either") +
                    " " +
                    question.get("or") +
                    "?"
            );
        } else {
            console.log(`Error: Could not find question with id: ${rand}`);
        }
    },
};
