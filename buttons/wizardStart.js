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
                return this.color;
            }
            set color(pColor) {
                this.color = pColor;
            }
            get number() {
                return this.number;
            }
            set number(pNumber) {
                this.number = pNumber;
            }
        }
        class Player {
            constructor(pId) {
                this.hand = [];
                this.points = 0;
                this.id = pId;
            }
            get hand() {
                return this.hand;
            }
            get points() {
                return this.points;
            }
            get id() {
                return this.id;
            }
            set id(pId) {
                this.id = pId;
            }
            submitGuess() {
                console.log(
                    "Please submit the amount of tricks you think you will make this round."
                );
            }
            playCard() {}
        }
        // initialisere player und allCards
        const allCards = [];
        for (let i = 0; i < 14; i++) {
            allCards.push(new Card("blue", i));
        }
        for (let i = 0; i < 14; i++) {
            allCards.push(new Card("red", i));
        }
        for (let i = 0; i < 14; i++) {
            allCards.push(new Card("yellow", i));
        }
        for (let i = 0; i < 14; i++) {
            allCards.push(new Card("green", i));
        }
        const players = [];
        const dataPlayers =
            interaction.client.sequelize.models.todSession.findAll({});
        const numberPlayers =
            await interaction.client.sequelize.models.wizardPlayer.count();
        console.log(
            dataPlayers.every((dataPlayers) => user instanceof wizardPlayer)
        );
        console.log("All users:", JSON.stringify(dataPlayers, null, 2));
        for (let i = 0; i < numberPlayers; i++) {}
    },
};
