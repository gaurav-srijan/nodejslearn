
const express = require("express");
const route = express.Router();
const Controller = require('../controller/user');
const {protect ,roleCheck} = require('./../middleware/auth');
//course
route.post("/user",Controller.createUser); 
route.post("/user/login",Controller.loginUser); 
route.get("/user/me",protect,Controller.getMe); 
route.post("/user/me/forget",Controller.forgetPassword); 
route.post("/user/resetpassword/:reset",Controller.resetPassword); 
//update user details
route.post("/user/me/update",protect,Controller.updateUserDetails); 
route.post("/user/me/password",protect,Controller.updatePassword); 
//route.delete("/course/:bootcampId",Controller.deleteCourse)

module.exports= route;