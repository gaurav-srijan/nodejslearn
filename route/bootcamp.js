
const express = require("express");
const route = express.Router();
const Controller = require('../controller/bootcamp');
const {protect,roleCheck} = require('.././middleware/auth');
//bootcamp
route.get("/bootcamp",Controller.Getfunction )
//post pending bootcamp
route.post("/bootcamp",protect,roleCheck("publisher" , "admin"),Controller.createBootcamp )


route.put("/bootcamp/:id/upload",protect,Controller.imageUpload)


//byid get,put,delete ->protect


module.exports= route;