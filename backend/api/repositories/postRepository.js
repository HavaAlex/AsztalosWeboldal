const db = require("../db/dbContext");
const category = require("../models/category");
const post = require("../models/post");
const { Sequelize } = require("sequelize");
class PostRepository
{
    constructor(db)
    {
        this.Post = db.post;
    }

    async createPost(post)
    {
        const newPost = await this.Post.build(post);

        await newPost.save();
        
        return newPost;
    }

    async getPosts()
    {
        return await this.Post.findAll();
    }
    async getPostsDesc()
    {
        return await this.Post.findAll({
            order:[
                uploadDate,
                DESC
            ]
        });
    }
    async countPostsByCatID(ID){
        return await this.Post.count({
            where: {
                categoryID:ID
            },
        });
    }

    async getLastPostDateInCategory(ID){
        return await this.Post.findOne({
            attributes: ['uploadDate'],
            where: {
                categoryID: ID
            },
            order: [['uploadDate', 'DESC']]

        });
    }
    async getPostsByDescDateHomePage(){
        return await this.Post.findAll({
            where:{
                showOnHomePage:true
            },
            order:[['uploadDate','DESC']]
            
        })
    }
    async getPostsByCategoryID(categoryID,sortKey,sortOrd){
        return await this.Post.findAll({
            where:{
                categoryID:categoryID
            },
            order:[[sortKey,sortOrd]]
            
        })
    }
    async getPostByID(ID)
    {
        return await this.Post.findOne
        (
            {
                where:
                {
                    ID: ID,
                }
            }
        )
    }
    async deletePost(ID){
        await this.Post.destroy({
            where:{
                ID: ID
            }
        })
        
        return "Post with ID:" + ID + " deleted."
    }
    async modifyPost(ID,newPost){
        const selectedPost = await this.Post.findOne({ where: { ID: ID } });
        
        await selectedPost.update({ title : newPost.title, subtitle:newPost.subtitle, desc:newPost.desc, categoryID: newPost.categoryID, showOnHomePage: newPost.showOnHomePage});
        console.log(">>Post with ID: " + ID + " title changed to " + newPost.title +" subtitle changed to " + newPost.subtitle + " desc changed to " + newPost.desc + " category changed to " + newPost.categoryID)
        return "Post with ID: " + ID + " title changed to " + newPost.title +" subtitle changed to " + newPost.subtitle + " desc changed to " + newPost.desc + " category changed to " + newPost.categoryID;
    }
}

module.exports = new PostRepository(db);