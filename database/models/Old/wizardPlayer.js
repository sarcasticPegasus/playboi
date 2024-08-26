// Importing classes
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "wizardPlayer",
        {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            active: { type: DataTypes.BOOLEAN, allowNull: false },
        },

        // Options
        { freezeTableName: true }
    );
};
