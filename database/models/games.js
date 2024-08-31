// Importing classes
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "games",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            owner: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            length: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            players: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tags: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },

        // Options
        { freezeTableName: true }
    );
};
