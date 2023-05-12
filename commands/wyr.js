const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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

        const wouldYouRather = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("WYR")
            .setDescription(`Would you rather...`)
            .addFields({
                name: `:a::  ${question.get("either")}.`,
                value: `.`,
            })
            .addFields({
                name: `:a::  ${question.get("or")}.`,
                value: `.`,
            });

        const message = await interaction.reply({
            embeds: [wouldYouRather],
        });

        message.react("🅰️");
        message.react("🅱️");
    },
};
