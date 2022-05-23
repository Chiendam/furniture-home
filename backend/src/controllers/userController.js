const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const apiFeatures = require('./../utils/apiFeatures');
const customError = require('./../utils/customError');


exports.create = catchAsync( async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success', 
    data: {
      user: newUser
    }
  })
})

exports.update = catchAsync( async (req, res, next)=>{
  console.log(req.params.id, req.body);
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new customError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getAll = catchAsync( async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success', 
    data: {
      users
    }
  })
})

exports.delete = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  console.log(user);

  if (!user) {
    return next(new customError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success', 
    data: {
      user
    }
  })
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

exports.updateMe =  catchAsync( async (req, res, next) => {
  // 1. Create error if user posts password data
  if(req.body.password || req.body.passwordConfirm) {
    return next(new customError('This is router not for update password. Please use router /updatePassword', 400))
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'fullName', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.deleteMe = catchAsync( async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: 'success',
    data: null
  });
})
