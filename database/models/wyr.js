// Importing classes
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "wyr",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            either: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: true,
            },
            or: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: true,
            },
            rating: { type: DataTypes.STRING, allowNull: false },
        },

        // Options
        { freezeTableName: true }
    );
};
