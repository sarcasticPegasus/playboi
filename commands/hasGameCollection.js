const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("has_game")
        .setDescription("check wether a game is available")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("the name of the game")
                .setRequired(true)
        ),
    async execute(interaction) {

        const name = interaction.options.getString("name").toLowerCase();
        

        const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Result:")
                .setDescription(
                    "The following games which fit your request are in our collection:"
                );
        
        const games =
            await interaction.client.sequelize.models.games.findAll({
                where: {
                    name: interaction.client.sequelize.where(interaction.client.sequelize.fn('LOWER', interaction.client.sequelize.col('name')), 'LIKE', '%' + name + '%')
                }
            });
            
        games.forEach(game => {
            embed.addFields({
                name: game.get("name"),
                value: `Description: ${game.get("description")}
                    Owner: ${game.get("owner")} \n Length: ${game.get("length")}
                    max. Players: ${game.get("players")} \n Tags: ${game.get("tags")}`,
            });
        });

        await interaction.reply({
            embeds: [embed]
        });   
        
    },
};
