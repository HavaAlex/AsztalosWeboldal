const categoryRepository  = require("../repositories/categoryRepository"); 
const postRepository = require("../repositories/postRepository")
const imageRepository = require("../repositories/imageRepository");
const postService = require("../services/postService")
class CategoryService
{
    async createCategory(category)
    {
        const tempCategory ={
            ID: null,
            name : category.name
        }
        const newCategory = await categoryRepository.createCategory(tempCategory);
            if(category.parentID!='-1' && category.parentID!=-1){
                const tempCategoryConnection = {
                    ParentID:category.parentID,
                    ChildID:newCategory.ID
                }
                await categoryRepository.createCategoryConnection(tempCategoryConnection);
        }

        return newCategory;
    }




    async buildCategoryTree(categories, connections, parentId = null) {
    const filtered = categories.filter(cat => {
        const id = cat.dataValues.ID;

        if (parentId === null) {
            return !connections.some(c => c.dataValues.ChildID === id);
        }

        return connections.some(
            c =>
                c.dataValues.ParentID === parentId &&
                c.dataValues.ChildID === id
        );
    });

    return Promise.all(filtered.map(async (cat) => {
        const id = cat.dataValues.ID;
        const children = await this.buildCategoryTree(categories, connections, id);

        if (children.length === 0) {


            return {
                ...cat.dataValues
            };
        }

        return {
            ...cat.dataValues,
            children
        };
    }));
    }

    async getCategories(){
        const categories = await categoryRepository.getCategories();
        const categoryConnections = await categoryRepository.getCategoryConnection();

        const tree = await this.buildCategoryTree(categories, categoryConnections);
        return tree;
        
    }








    async buildCategoryTreeAdmin(categories, connections, parentId = null) {
    const filtered = categories.filter(cat => {
        const id = cat.dataValues.ID;

        if (parentId === null) {
            return !connections.some(c => c.dataValues.ChildID === id);
        }

        return connections.some(
            c =>
                c.dataValues.ParentID === parentId &&
                c.dataValues.ChildID === id
        );
    });

    return Promise.all(filtered.map(async (cat) => {
        const id = cat.dataValues.ID;
        const children = await this.buildCategoryTreeAdmin(categories, connections, id);

        if (children.length === 0) {
            const postCount = await postRepository.countPostsByCatID(id);
            const imageCount = await imageRepository.countImagesByCatID(id);

            const lastPost = await postRepository.getLastPostDateInCategory(id);
            const lastDate = lastPost ? lastPost.dataValues.uploadDate : null;

            return {
                ...cat.dataValues,
                postCount,
                imageCount,
                lastDate
            };
        }

        return {
            ...cat.dataValues,
            children
        };
    }));
}

    async getCategoriesAdmin(){
        const categories = await categoryRepository.getCategories();
        const categoryConnections = await categoryRepository.getCategoryConnection();

        const tree = await this.buildCategoryTreeAdmin(categories, categoryConnections);
        console.log("Faszom ble: " , tree);
        return tree;
        
    }
}

module.exports = new CategoryService();