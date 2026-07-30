const express = require("express");

const router = express.Router();


const viewerController = require("../controllers/viewerController");

router.get("/categories", viewerController.getCategories);
router.get("/posts",viewerController.getPosts)
router.get("/posts/newest",viewerController.getPostsByNewest)
router.get("/posts/:category/:attribute/:ord", viewerController.getPostsByCategories);
module.exports = router;