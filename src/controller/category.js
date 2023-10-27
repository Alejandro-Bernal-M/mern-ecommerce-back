const Category = require('../models/category');
const slugify = require('slugify');

exports.createCategory = async(req, res) => {

  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name)
  };

  if(req.body.parentId){
    categoryObj.parentId = req.body.parentId
  }

  const newCategory = new Category(categoryObj)

  try {
    const savedCategory = await newCategory.save();
    if(savedCategory == newCategory){
      res.status(200).json({savedCategory});
    }else {
      res.status(400).json({message: 'error saving category'})
    }

  } catch (error) {
    console.log(error);
    res.status(400).json({message: 'something went wrong', error: error})
  }

};

exports.getCategories = async(req, res) => {
  try {
    const categories = await Category.find({});
    if(categories){
      res.json({categories})
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({message: 'Error fetching categories', error: error})
  }
}