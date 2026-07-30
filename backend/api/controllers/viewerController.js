const categoryRepository  = require("../repositories/categoryRepository"); 
const postService = require("../services/postService")
const categoryService = require("../services/categoryService")
exports.getCategories = async (req, res, next) => 
{
    let aaa = await categoryService.getCategories()
    
    res.status(200).send(aaa);
}

exports.getPosts = async (req,res,next) =>{
  try{
    const takenPosts = req.headers.ids;
    console.log(takenPosts)
    res.status(200).json(await postService.getPosts(takenPosts));
  }
  catch (error){
    console.error("Post fetch error: " , error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

exports.getPostsByNewest = async (req,res,next) =>{
  try{
    const takenPosts = req.headers.ids;
    res.status(200).json(await postService.getPostsByNewest(takenPosts));
  }
  catch (error){
    console.error("Post fetch error: " , error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

exports.getPostsByCategories = async (req, res, next) => 
{
      try{
        const takenPosts = req.headers.ids;
        const catID = req.params.category
        const sortKey = req.params.attribute
        const sortOrd = req.params.ord
        res.status(200).json(await postService.getPostsByCategoryID(takenPosts,catID,sortKey,sortOrd));
    }
    catch (error){
        console.error("Post fetch error: " , error);
        res.status(500).json({ message: "Error fetching posts" });
    }
}