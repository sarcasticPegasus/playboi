// Importing classes
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "truth",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            content: {
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
