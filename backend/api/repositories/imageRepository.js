const db = require("../db/dbContext");
const image = require("../models/image");
const { Op, where } = require("sequelize");
const fs = require("fs");

const sharp = require ("sharp")
const path = require("path");
const post = require("../models/post");


class ImageRepository
{
    constructor(db)
    {
        this.Image = db.image;
        this.Post = db.post;
    }
    //Probably won't be used
    async getImages()
    {
        return await this.Image.findAll();
    }

    async getImageByID(ID)
    {
        return await this.Image.findOne
        (
            {
                where:
                {
                    ID: ID,
                }
            }
        )
    }

    async countImagesByCatID(categoryID){
        return await this.Image.count({
            include: [{
                model: this.Post,
                required: true,
                where: {
                categoryID:categoryID
                }
            }]
        });
    }
    async deleteImage(ID){
        let temp = await this.Image.findOne({
            where:{
                ID:ID
            }
        })
        await this.Image.destroy({
            where:{
                ID: ID
            }
        })
    
        await fs.promises.rm(path.join(process.cwd() , "../api/img/" , temp.postID.toString(),"/medium/",temp.filename), { recursive: true });
        await fs.promises.rm(path.join(process.cwd() , "../api/img/" , temp.postID.toString(),"/thumb/",temp.filename), { recursive: true });
        await fs.promises.rm(path.join(process.cwd() , "../api/img/" , temp.postID.toString(),"/original/",temp.filename), { recursive: true });
        return "Image with ID:" + ID + " deleted."
    }

    async getImagesByPostID(postID) {
        return await this.Image.findAll({
            where: {
                postID:postID
            },
        });
    }

    async deleteImagesByPostID(postID) {
        await this.Image.destroy({
            where:{
                postID: postID
            }
        })
        if(fs.existsSync(path.join(process.cwd() , "../img/" , postID.toString()) )){
            await fs.promises.rm(path.join(process.cwd() , "../img/" , postID.toString()), { recursive: true });
        }


        return "Image successfully deleted"
    }

    async createImages(files, postID) { 
        const sizes = [
            { name: "medium", max: 800 }
        ];
        await Promise.all(
            files.map(async file => {

                const dbimage={
                    ID:null,
                    postID:postID,
                    filename:file.originalname
                }

                const newImage = await this.Image.build(dbimage);

                await newImage.save();

                if (!file.mimetype?.startsWith("image/")) {
                    throw new Error("Invalid file type");
                }
                const dirPath = path.join(process.cwd(), "../img/" + postID.toString());

                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                    fs.mkdirSync(dirPath+"/original", { recursive: true });
                    for (let i = 0; i < sizes.length; i++) {
                        
                        fs.mkdirSync(dirPath+"/"+sizes[i].name, { recursive: true });
                    }
                }
                fs.writeFileSync(path.join(dirPath+"/original", file.originalname), file.buffer);


                const image = sharp(file.buffer).rotate();
                const metadata = await image.metadata();


                if (!metadata.width || !metadata.height) {
                    throw new Error("Invalid image metadata");
                }


                const isLandscape = metadata.width >= metadata.height;


                await Promise.all(
                    sizes.map(size => {
                        const resizeOptions = isLandscape ? { width: size.max } : { height: size.max };


                        return sharp(file.buffer).rotate().resize({
                            ...resizeOptions,
                            withoutEnlargement: true
                        }).webp({ quality: 80 }).toFile(path.join(dirPath+"/"+size.name, file.originalname));
                    })
                )
            })
        );
        
        console.log("Images successfuly uploaded")
        return "Successful upload";
    }


}

module.exports = new ImageRepository(db);