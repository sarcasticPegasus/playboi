const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const wyr = require("../database/models/wyr");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wyr")
        .setDescription("Sends a random Would You Rather question.")
        .addBooleanOption((option) =>
            option
                .setName("random")
                .setDescription(
                    "Whether or not the either and ors should be completely random."
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const random = interaction.options.getBoolean("random");
        const wouldYouRather = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("WYR")
            .setDescription(`Would you rather...`);

        const rows = await interaction.client.sequelize.models.wyr.count();
        const rand1 = Math.floor(Math.random() * rows) + 1;
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const question1 = await interaction.client.sequelize.models.wyr.findOne(
            {
                where: { id: rand1 },
            }
        );
        if (!random) {
            wouldYouRather
                .addFields({
                    name: `:a::  ${question1.get("either")}.`,
                    value: `-`,
                })
                .addFields({
                    name: `:b::  ${question1.get("or")}.`,
                    value: `-`,
                });
        } else {
            const rand2 = Math.floor(Math.random() * rows) + 1;
            const question2 =
                await interaction.client.sequelize.models.wyr.findOne({
                    where: { id: rand2 },
                });
            wouldYouRather
                .addFields({
                    name: `:a::  ${question1.get("either")}.`,
                    value: `-`,
                })
                .addFields({
                    name: `:b::  ${question2.get("or")}.`,
                    value: `-`,
                });
        }
        const wyrButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("wyrA")
                .setLabel("🅰️")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("wyrB")
                .setLabel("🅱️")
                .setStyle(ButtonStyle.Secondary)
        );
        const message = await interaction.reply({
            embeds: [wouldYouRather],
            components: [wyrButtons],
        });
    },
};
