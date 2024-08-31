const { SlashCommandBuilder, userMention } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stat_check")
        .setDescription("rolls a die of specified type (xdx)")
        .addStringOption((option) =>
            option
                .setName("stat")
                .setDescription("Which stat to check.")
                .addChoices(
                    { name: "Skill", value: "skill" },
                    { name: "Charisma", value: "charisma" },
                    { name: "Stealth", value: "stealth" }
                )
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
                    { name: "Attack Opponent", value: 4 },
                    { name: "Special", value: 5 }
                )
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("opponent")
                .setDescription("The character you want to check against.")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("player")
                .setDescription("Here the DM rolls for the player. Only for the DM")
                .setRequired(false)
        ),
        
    async execute(interaction) {
        const stat = interaction.options.getString("stat");
        const difficulty = interaction.options.getInteger("difficulty");
        const opponent = interaction.options.getUser("opponent");
        const player = interaction.options.getUser("player");
        const user = interaction.user;
        const channel = interaction.channel;
        var roll = Math.floor(Math.random() * 20) + 1;
        if (difficulty == 1) {
            roll = roll - 5;
        } else if(difficulty == 3) {
            roll = roll + 5;
        }

        if (player != null) {
            if (user != 1080894550031216740) {
                await interaction.reply({
                    content: `Rolling for a player can only be done by the DM.`,
                    ephemeral: true,
                });
            } else {
                const playerData = await interaction.client.sequelize.models.characterRPG.findOne({
                    where: { id: player.id },
                });
                if (playerData == null) {
                    await interaction.reply({
                        content: `This user does not have a character yet.`,
                        ephemeral: true,
                    });
                } else {
                    if (difficulty != 5) {
                        if ((playerData.get(stat) - roll >= 0)){
                            await interaction.reply(
                                `${playerData.get("charactername")} made a successful ${stat} check!`
                            );
                        } else {
                            await interaction.reply(
                                `${playerData.get("charactername")} failed a ${stat} check...`
                            );
                        }
                    } else {
                        await interaction.reply({
                            content: `Special checks have not been implemented yet, sorry.`, // TODO
                            ephemeral: true,
                        });
                    }                    
                }
            }
        } else {
            const userData = await interaction.client.sequelize.models.characterRPG.findOne({
                where: { id: user.id },
            });
            if (userData == null) {
                await interaction.reply({
                    content: `You can't use this command without having a character.`,
                    ephemeral: true,
                });
            } else {
                roll = userData.get(stat) - roll;
                if (difficulty == 4){
                    if (opponent == null){
                        await interaction.reply({
                            content: `You have to choose an opponent to check against.`,
                            ephemeral: true,
                        });
                    } else {
                        var roll2 = Math.floor(Math.random() * 20) + 1;
                        const opponentData = await interaction.client.sequelize.models.characterRPG.findOne({
                            where: { id: opponent.id },
                        });
                        if (opponentData == null) {
                            await interaction.reply({
                                content: `Your opponent must have a character.`,
                                ephemeral: true,
                            });
                        } else {
                            roll2 = opponentData.get(stat) - roll2;
                            if (roll == roll2) {
                                await interaction.reply(
                                    `${userData.get("charactername")} and ${opponentData.get("charactername")} had a tie!`
                                );
                            } else if(roll > roll2) {
                                await interaction.reply(
                                    `${userData.get("charactername")} challenged ${opponentData.get("charactername")} in ${stat} and won!`
                                );
                            } else {
                                await interaction.reply(
                                    `${userData.get("charactername")} challenged ${opponentData.get("charactername")} in ${stat} and lost...`
                                );
                            }
                        }
                    }
                    
                } else if (difficulty == 5){
                    await interaction.reply({
                        content: `You cannot use difficulty Special, only the DM can.`, // TODO
                        ephemeral: true,
                    });
                } else {
                    difficultyString = "";
                    switch (difficulty) {
                        case 1:
                            difficultyString = "Easy"
                            break;
                        case 2:
                            difficultyString = "Normal"
                            break;
                        case 3:
                            difficultyString = "Hard"
                    
                        default:
                            difficultyString = "Error"
                            break;
                    }
                    if (roll >= 0) {
                        await interaction.reply(
                            `Yay, ${userData.get("charactername")}'s ${stat} check at difficulty ${difficultyString} was successful!`
                        );
                    } else {
                        await interaction.reply(
                            `Oh no! ${userData.get("charactername")} failed their ${stat} check at difficulty ${difficultyString}...`
                        );
                    }
                }
            }            
        }
    },
};
