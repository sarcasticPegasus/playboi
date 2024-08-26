const { SlashCommandBuilder, range } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_character")
        .setDescription("creates a character for stupid little rpg")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("The name of your character")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("race")
                .setDescription("The race of your character")
                .addChoices(
                    { name: "Human", value: "Human" },
                    { name: "Elf", value: "Elf" },
                    { name: "Dwarf", value: "Dwarf" }
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("class")
                .setDescription("The class of your character")
                .addChoices(
                    { name: "Fighter", value: "Fighter" },
                    { name: "Mage", value: "Mage" },
                    { name: "Berserk", value: "Berserk" },
                    { name: "Ranger", value: "Ranger" },
                    { name: "Cleric", value: "Cleric" },
                    { name: "Rogue", value: "Rogue" }
                )
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("skill")
                .setDescription("how good you are with your weapons, important if you want to hit (between 10 and 15)")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("charisma")
                .setDescription("how well you can influence npcs and other characters (between 10 and 15)")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("stealth")
                .setDescription("for stealth and lockpicking (between 10 and 15)")
                .setRequired(true)
        ),
    async execute(interaction) {
        var correct_stats = false;
        var skill = interaction.options.getInteger("skill");
        var charisma = interaction.options.getInteger("charisma");
        var stealth = interaction.options.getInteger("stealth");
        if(skill >= 10 && skill <= 15 && charisma >= 10 && charisma <= 15 && stealth >= 10 && stealth <= 15 && skill+charisma+stealth <= 37){correct_stats = true};
        if(!correct_stats){
            await interaction.reply({
                content: `Each stat must be a number between 10 and 15 and the sum of your stats cannot exceed 37! Please try again.`,
                ephemeral: true,
            });

        } else {
            const id = interaction.user.id;
            const username = interaction.user.username;
            const charactername = interaction.options.getString("name");
            const race = interaction.options.getString("race");
            const chaclass = interaction.options.getString("class");

            //calculating hpmax, melee and ranged according to race and class
            var hpmax;
            var melee;
            var ranged;
            switch (chaclass) {
                case "Fighter":
                    hpmax = 30;
                    melee = "3x5";
                    ranged = "3x4";
                    if(race == "Dwarf"){
                        melee = "3x6";
                    }
                    if(race == "Elf"){
                        ranged = "3x5";
                    }
                    break;
                case "Mage":
                    hpmax = 24;
                    melee = "none";
                    ranged = "4x8";
                    if(race == "Dwarf"){
                        melee = "2x3";
                    }
                    if(race == "Elf"){
                        ranged = "4x9";
                    }
                    break;
                case "Berserk":
                    hpmax = 35;
                    melee = "3x9";
                    ranged = "none";
                    if(race == "Dwarf"){
                        melee = "3x10";
                    }
                    if(race == "Elf"){
                        ranged = "2x3";
                    }
                    break;
                case "Ranger":
                    hpmax = 30;
                    melee = "3x4";
                    ranged = "3x5";
                    if(race == "Dwarf"){
                        melee = "3x5";
                    }
                    if(race == "Elf"){
                        ranged = "3x6";
                    }
                    break;
                case "Cleric":
                    hpmax = 26;
                    melee = "3x2";
                    ranged = "3x3";
                    if(race == "Dwarf"){
                        melee = "3x3";
                    }
                    if(race == "Elf"){
                        ranged = "3x4";
                    }
                    break;
                case "Rogue":
                    hpmax = 26;
                    melee = "2x3";
                    ranged = "2x3";
                    if(race == "Dwarf"){
                        melee = "2x4";
                    }
                    if(race == "Elf"){
                        ranged = "2x4";
                    }
                    break;
            
                default:
                    hpmax = 27;
                    melee = "3x4";
                    ranged = "3x4";
                    break;
            }

            if(race == "Human"){
                skill++;
                charisma++;
                stealth++;
            } else if(race == "Dwarf"){
                skill++;
            } else if(race == "Elf"){
                charisma++;
            }

            interaction.client.sequelize.models.characterRPG.upsert({
                id: id,
                username: username,
                charactername: charactername,
                race: race,
                class: chaclass,
                skill: skill,
                charisma: charisma,
                stealth: stealth,
                hpmax: hpmax,
                hp: hpmax,
                melee: melee,
                ranged: ranged,
            });

            await interaction.reply(
                `The ${race} ${chaclass} ${charactername} was successfully created!`
            );
        }
    },
};
