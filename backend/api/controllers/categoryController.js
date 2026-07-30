const categoryRepository  = require("../repositories/categoryRepository"); 
const categoryService = require("../services/categoryService")
exports.getCategoriesAdmin = async (req, res, next) => 
{
    res.status(200).send(await categoryService.getCategoriesAdmin());
}

exports.addCategory = async (req, res, next) => 
{
    let { data } = req.body;
    res.status(201).send(await categoryService.createCategory(data));
}
exports.modifyCategory = async (req, res, next) => 
{
    let {data} = req.body;
    console.log(">>Modified category data:", data)
    
    res.status(201).send(await categoryRepository.changeCategoryName(data.ID,data.name));
}
exports.deleteCategory = async (req, res, next) => 
{
    let Id = JSON.parse(req.params.id)
    console.log("ID: ", Id)
    res.status(201).send(await categoryRepository.deleteCategory(Id));
}