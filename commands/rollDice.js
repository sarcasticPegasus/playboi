const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll_dice")
        .setDescription("rolls a die of specified type (xdx)")
        .addIntegerOption((option) =>
            option
                .setName("number")
                .setDescription("The number of dice you want to roll")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("kind")
                .setDescription("The kind of die you want to roll")
                .setRequired(true)
        ),
    async execute(interaction) {
        const number = interaction.options.getInteger("number");
        const kind = interaction.options.getInteger("kind");
        let result = 0;
        for (let i = 0; i < number; i++) {
            result = result + Math.floor(Math.random() * kind) + 1;
        }
        await interaction.reply(
            `You rolled ${number}d${kind} and got a ${result}`
        );
    },
};
