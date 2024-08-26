// Importing classes
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "characterRPG",
        {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            username: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            charactername: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            race: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            class: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            skill: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            charisma: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            stealth: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            hpmax: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            hp: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            melee: { // weapons have the format of: "numberofattacsxdamage (eg: 5x4), "none" if false
                type: DataTypes.STRING,
                allowNull: false,
            },
            ranged: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },

        // Options
        { freezeTableName: true }
    );
};
