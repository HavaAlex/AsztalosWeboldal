const postRepository = require("../repositories/postRepository");
const imageRepository = require("../repositories/imageRepository");
class PostService{
    async getPosts(IDs){
        //console.log(IDs)
        const allPost = await postRepository.getPosts();
        const returnPosts = []
        let i = 0;
        //console.log(">>Fetching posts.")
        //console.log(">>Posts already fetched: ", IDs)
        while(returnPosts.length<20 && i < allPost.length){
            
            if(!IDs.includes(allPost[i].ID)){
                allPost[i].dataValues.images = await imageRepository.getImagesByPostID(allPost[i].ID)
                returnPosts.push(allPost[i]);
            }
            i++;
        }
        //console.log(">>Fetched ",returnPosts.length," posts.")
        
        const arr = []
        returnPosts.map((x) => arr.push(x.ID))
        //console.log(">>Fetched posts: ",arr)
        return returnPosts;
    }
    async getPostsByNewest(IDs){
        
        const allPost = await postRepository.getPostsByDescDateHomePage();
        const returnPosts = []
        let i = 0;
        
        //console.log(">>Fetching posts.")
        //console.log(">>Posts already fetched: ", IDs)
        while(returnPosts.length<20 && i < allPost.length){
            
            if(!IDs.includes(allPost[i].ID)){
                //console.log("eljön ide ", allPost[i].ID)
                allPost[i].dataValues.images = await imageRepository.getImagesByPostID(allPost[i].ID)
                returnPosts.push(allPost[i]);
            }
            i++;
        }
        //console.log(">>Fetched ",returnPosts.length," posts.")
        
        const arr = []
        returnPosts.map((x) => arr.push(x.ID))
        //console.log(">>Fetched posts: ",arr)
        return returnPosts;
    }

    async getPostsByCategoryID(IDs,categoryID,sortKey,sortOrd){
        
        const allPost = await postRepository.getPostsByCategoryID(categoryID,sortKey,sortOrd);
        const returnPosts = []
        let i = 0;
        
        /*console.log(">>Fetching posts.")
        console.log(">>Category of posts: ",categoryID)
        console.log(">>Posts already fetched: ", IDs)*/
        while(returnPosts.length<20 && i < allPost.length){
            
            if(!IDs.includes(allPost[i].ID)){
                allPost[i].dataValues.images = await imageRepository.getImagesByPostID(allPost[i].ID)
                returnPosts.push(allPost[i]);
            }
            i++;
        }
        //console.log(">>Fetched ",returnPosts.length," posts.")
        
        const arr = []
        returnPosts.map((x) => arr.push(x.ID))
        //console.log(">>Fetched posts: ",arr)
        return returnPosts;
    }


    async addPostWithImages(files, post) {
        const newPost={
            ID:null,
            title: post.title,
            subtitle: post.subtitle,
            desc: post.desc,
            categoryID: post.categoryID,
            uploadDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            showOnHomePage: post.showOnHomePage
        }
        
        
        const successfullPost = await postRepository.createPost(newPost);
        
        await imageRepository.createImages(files,successfullPost.ID)

        return "Files uploaded successfully";
    }

    async modifyPost(uploadedFiles,post){
        await postRepository.modifyPost(post.ID,post)
        await imageRepository.createImages(uploadedFiles,post.ID)
        
    }

    async deletePost(id){
        //console.log("ID:" , id)
        await imageRepository.deleteImagesByPostID(id);
        await postRepository.deletePost(id);
        //console.log(">>Post with ID: "+id+ " successfully deleted!")
        return "Post deleted successfully"
    }
}

module.exports = new PostService();