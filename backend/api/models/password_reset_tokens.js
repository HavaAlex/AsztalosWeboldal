const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Password_reset_tokens extends Model {};

    Password_reset_tokens.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            userID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name:
            {
                type: DataTypes.STRING(100),
                allowNull: false
            },
        },

        {
            sequelize,
            modelName: "Password_reset_tokens",
            timestamps: false,
        }
    )

    return Password_reset_tokens;
}