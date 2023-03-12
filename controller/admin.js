const User =  require('../module/userModel');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/Error');
// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    let query = JSON.stringify(req.query);
    //console.log("check query1" , query);

    query = query.replace(/\b(gt|gte|lt|lte|in)\b/g , match=>`$${match}`);
    //console.log("check query2" , query);
        let usersave  = User.find(JSON.parse(query))
        //select field
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            usersave =  usersave.select(fields);
        }
        //sort
        if(req.query.sort){
            const fields = req.query.sort.split(',').join(' ');
            usersave =  usersave.sort(fields);
        }
        //paginate
        const page = parseInt(req.query.page , 10 ) || 1 ;
        const limit = parseInt(req.query.limit , 10 ) || 100 ;
        const startIndex = (page -1 )*limit;
        const endIndex = page * limit;
        const total = await User.countDocuments();   
        console.log("checking data" , total);
        usersave =  usersave.skip(startIndex).limit(limit);
        const response = await usersave;
        //pagination details
        let Paginate ={}
        if(endIndex < total){
            Paginate.next = {
                page : page +1 , 
                limit
            }
        }
        if(startIndex > 0){
            Paginate.prev = {
                page : page - 1 , 
                limit
            }
        }
  res.status(200).json(response);
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
