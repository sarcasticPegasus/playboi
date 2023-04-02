// Importing classes
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "player",
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
            skips: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            hasConfirmed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            active: { type: DataTypes.BOOLEAN, allowNull: false },
        },

        // Options
        { freezeTableName: true }
    );
};
