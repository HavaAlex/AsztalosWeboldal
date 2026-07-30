const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Category extends Model {};

    Category.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            modelName: "Category",
            timestamps: false,
        }
    )

    return Category;
}