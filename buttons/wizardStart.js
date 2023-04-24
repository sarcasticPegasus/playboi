const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "wizardStart",
    },

    async execute(interaction) {
        class Card {
            constructor(pColor, pNumber) {
                this.color = pColor;
                this.number = pNumber;
            }
            get color() {
                return color;
            }
            get number() {
                return number;
            }
        }
        class Player {
            constructor() {
                this.hand = [];
                this.points = 0;
            }
            submitGuess() {
                console.log(
                    "Please submit the amount of tricks you think you will make this round."
                );
            }
        }
        const player = new Player();
        player.submitGuess();
    },
};
