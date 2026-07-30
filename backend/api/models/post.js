const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Post extends Model {};

    Post.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            categoryID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title:
            {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            subtitle:
            {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            desc:
            {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
            uploadDate:
            {
                type: DataTypes.DATE,
                allowNull: false,
            },
            showOnHomePage:{
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        },

        {
            sequelize,
            modelName: "Post",
            timestamps: false,
        }
    )

    return Post;
}