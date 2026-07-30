const db = require("../db/dbContext");
const category = require("../models/category");
const image = require("../models/image");
const post = require("../models/post");
class CategoryRepository
{
    constructor(db)
    {
        this.Category = db.category;
        this.Post = db.post;
        this.Image = db.image;
        this.CategoryConnection = db.categoryConnection;
    }

    async createCategory(category)
    {
        const newCategory = await this.Category.build(category);

        await newCategory.save();
        
        return newCategory;
    }

    async createCategoryConnection(categoryConnection){
        const newcategoryConnection = await this.CategoryConnection.build(categoryConnection);
        await newcategoryConnection.save();
        return newcategoryConnection;
    }

    async getCategories()
    {
        return await this.Category.findAll();
    }
    async getCategoryConnection(){
        return await this.CategoryConnection.findAll();
    }
    async getCategoryByID(ID)
    {
        return await this.Category.findOne
        (
            {
                where:
                {
                    ID: ID,
                }
            }
        )
    }
    async deleteCategory(ID) {

        const posts = await this.Post.findAll({
            where: { categoryID: ID },
            attributes: ['ID'] 
        });

        const postIDs = posts.map(post => post.ID);


        if (postIDs.length > 0) {
            await this.Image.destroy({
                where: {
                    postID: postIDs 
                }
            });
        }


        await this.Post.destroy({
            where: {
                categoryID: ID
            }
        });


        await this.Category.destroy({
            where: {
                ID: ID
            }
        });
        
        return "Category with ID:" + ID + " and all associated posts and images deleted.";
    }
    async changeCategoryName(ID,newName){
        const selectedCategory = await this.Category.findOne({ where: { ID: ID } });
        await selectedCategory.update({ name : newName });
        return "Category with ID: " + ID + " name changed to " + newName;
    }
}

module.exports = new CategoryRepository(db);