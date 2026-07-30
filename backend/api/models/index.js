module.exports = (sequelize, DataTypes) => {

    const User = require("../models/user")(sequelize, DataTypes);
    const Category = require("../models/category")(sequelize, DataTypes);
    const Post = require("../models/post")(sequelize, DataTypes);
    const Image = require("../models/image")(sequelize, DataTypes);
    const CategoryConnection = sequelize.define('CategoryConnection',{},{timestamps:false});
    
    Post.belongsTo(Category, {foreignKey: 'categoryID'})
    Category.hasMany(Post,{foreignKey: 'categoryID'})
    
    Post.hasMany(Image, {foreignKey: 'postID'})
    Image.belongsTo(Post, {foreignKey: 'postID'})

    Category.belongsToMany(Category,{
        as:'parent',
        through:CategoryConnection,
        foreignKey:'ParentID',
        otherKey:'ChildID'
    })

    return { User,Category,Post,Image,CategoryConnection };
} 