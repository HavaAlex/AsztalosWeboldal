const express = require("express");
const multer = require("multer");
const router = express.Router();

const userAuth = require("../middlewares/userAuth")
const categoryController = require("../controllers/categoryController");
const postController = require("../controllers/postController");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.use(userAuth.verifyToken);


//router.post("/password")

router.get("/categories", categoryController.getCategoriesAdmin);
router.post("/categories", categoryController.addCategory);
router.put("/categories", categoryController.modifyCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

router.post("/posts",upload.array("files"),postController.addPost)
router.patch("/posts",upload.array("files"),postController.modifyPost)
router.get("/posts",postController.getPosts)
router.delete("/posts/:id",postController.deletePost)

router.delete("/image/:ID/",postController.deleteImage)


module.exports = router;