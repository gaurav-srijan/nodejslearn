
const express = require("express");
const route = express.Router();
const Controller = require('../controller/course');
const {protect, roleCheck } = require('./../middleware/auth');
//course
route.get("/course",Controller.getCourse); 
route.get("/course/:bootcampId",Controller.getByIdCourse)
route.post("/course/:bootcampId",protect ,roleCheck("publisher" , "admin"),Controller.postCourse)
route.put("/course/:courseId",protect , roleCheck("publisher" , "admin"),Controller.updateCourse)
route.delete("/course/:bootcampId",protect ,roleCheck("publisher" , "admin"),Controller.deleteCourse)

module.exports= route;