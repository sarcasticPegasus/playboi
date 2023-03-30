// Importing classes
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "todSession",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            skips: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            qGiver: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            qTaker: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },

        // Options
        { freezeTableName: true }
    );
};
