const {
    SlashCommandBuilder,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("character_rpg")
        .setDescription("view one specific or all playing characters")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("the user whos character you'd like to see")
                .setRequired(false)
        ),
    async execute(interaction) {
        const channel = interaction.channel;
        const user = interaction.options.getUser("user");

        if(user != null){
            // get the info of the character
            const character =
                await interaction.client.sequelize.models.characterRPG.findOne({
                    where: { id: user.id },
                });
            if (character != null) {
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(character.get("charactername"))
                    .setDescription(`Details of ${character.get("charactername")} `)
                    .addFields({
                        name: "Race",
                        value: character.get("race"),
                    })
                    .addFields({
                        name: "Class",
                        value: character.get("class"),
                    })
                    .addFields({
                        name: "Health Points",
                        value: `${character.get("hp")} / ${character.get("hpmax")}`,
                    })
                    .addFields({
                        name: "Melee Attack",
                        value: character.get("melee"),
                    })
                    .addFields({
                        name: "Ranged Attack",
                        value: character.get("ranged"),
                    });
                await interaction.reply({
                    embeds: [embed]
                });
            } else {
                await interaction.reply({
                    content: `This user does not have a character yet.`,
                    ephemeral: true,
                });
            }
            

        } else {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("Characters:")
                .setDescription(
                    "An overwiev of all characters."
                );

            const characters =
                await interaction.client.sequelize.models.characterRPG.findAll();
            
            characters.forEach(character => {
                var a = "A";
                if (character.get("race") == "Elf") {
                    a = "An";
                }
                embed.addFields({
                    name: character.get("charactername"),
                    value: `${a} ${character.get("race")} ${character.get("class")} by ${userMention(character.get("id"))}.`,
                });
            });
            await interaction.reply({
                embeds: [embed]
            });         
        }
    },
};
