const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Image extends Model {};

    Image.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            postID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            filename:{
                type: DataTypes.STRING(500),
                allowNull:false
            }
        },

        {
            sequelize,
            modelName: "Image",
            timestamps: false,
        }
    )

    return Image;
}