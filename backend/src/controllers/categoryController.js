const Category = require('../models/categoriesModel');
const handler = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const customError = require('../utils/customError');

exports.setUserId = (req, res, next) => {
  if(!req.body.user_create) req.body.user_create = req.user.id;
  next();
}

exports.getAll = handler.getAll(Category);
exports.getOne = handler.getOne(Category);
exports.createOne = handler.createOne(Category);
exports.updateOne = handler.updateOne(Category);
exports.deleteOne = handler.deleteOne(Category);

exports.validateCreate = catchAsync(async (req, res, next) => {
  let result;
  if(req.params.id){
    result = req.body.parent ? await Category.finOne({
      $and: [
        {_id: req.body.parent},
        {parent: {$ne: req.params.id}}
      ],
    }) : true;
  } else {
    //check exists category id parent
    result = req.body.parent ? await Category.findById(req.body.parent) : true;
  }
  console.log(result, req.body.parent);
  if(!result) {
    return next(new customError('No document found with that parent category', 404));
  }
  return next();
});

