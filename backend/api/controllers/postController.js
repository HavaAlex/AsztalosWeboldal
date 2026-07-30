const postService = require("../services/postService")
const imageRepository = require("../repositories/imageRepository")

exports.addPost = async (req, res, next) => {
  try {
    const uploadedFiles = req.files;
    const post  = req.body; 
    console.log("postos: ",post)
    if(!uploadedFiles || uploadedFiles.length == 0){
      res.status(500).json("Hiba! Képek nélkül nem lehet bejegyzést létrehozni!")
      return;
    }
    res.status(200).json(await postService.addPostWithImages(uploadedFiles,post));
    return;
  } catch (error) {
    console.error("Post adding error:", error);
    res.status(500).json({ message: "Error uploading post" });
    return;
  }
};

exports.modifyPost = async (req, res, next) => {
  try {
    const uploadedFiles = req.files;
    const post  = req.body; 
    //console.log("Bányásszad öregem: ")
    //console.log(req)
    res.status(200).json(await postService.modifyPost(uploadedFiles,post));
  } catch (error) {
    console.error("Modify error:", error);
    res.status(500).json({ message: "Error modifying post" });
  }
};

exports.getPosts = async (req,res,next) =>{
  try{
    const takenPosts = req.headers.ids;
    res.status(200).json(await postService.getPosts(takenPosts));
  }
  catch (error){
    console.error("Post fetch error: " , error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

exports.deletePost = async (req,res,next) =>{
    let Id = JSON.parse(req.params.id)
    console.log(">>deleting post with id: ", Id)
    res.status(201).send(await postService.deletePost(Id));
}


exports.deleteImage = async (req,res,next) =>{
    
    let Id = req.params.ID
    
    console.log(">>deleting image with id: ", Id)
    res.status(201).send(await imageRepository.deleteImage(Id));
}
