const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("attack")
        .setDescription("rolls a die of specified type (xdx)")
        .addUserOption((option) =>
            option
                .setName("opponent")
                .setDescription("The character you want to attack or you want to controll the npc")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("pvp")
                .setDescription("Wether you want to attack the opponent or not.")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("difficulty")
                .setDescription("The race of your character")
                .addChoices(
                    { name: "Easy", value: 1 },
                    { name: "Normal", value: 2 },
                    { name: "Hard", value: 3 },
                    { name: "Special", value: 4 }
                )
                .setRequired(true)
        ),
        
    async execute(interaction) {
        
        const difficulty = interaction.options.getInteger("difficulty");
        if (difficulty != 4) {
            
        } else {
            
        }
        const channel = interaction.channel;
        const user = interaction.user.id;
        const character =
            await interaction.client.sequelize.models.characterRPG.findOne({
                where: { id: user.id },
            });
        let result = 0;
        for (let i = 0; i < number; i++) {
            result = result + Math.floor(Math.random() * kind) + 1;
        }
        await interaction.reply(
            `You rolled ${number}d${kind} and got a ${result}`
        );
    },
};
