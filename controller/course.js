const course =  require('../module/courses');
const Bootcamp =  require('../module/bootcamp');
const asyncHandler = require('../middleware/async');

exports.getCourse = async(req,res,next)=>{

    try {
        const courseData = await course.find().populate({
            path : "bootcamp" , 
            select : "name"
        })
        res.status(200).json(courseData)
    } catch (error) {
        next(error);
    }

}
exports.getByIdCourse = async(req,res,next)=>{

    try {
        const {bootcampId} = req.params
        const courseData = await course.find({bootcamp :bootcampId})
        res.status(200).json(courseData)
    } catch (error) {
        next(error);
    }

}

//post

exports.postCourse = async(req,res,next)=>{
    try {
        req.body.bootcamp = req.params.bootcampId
        req.body.user = req.user.id
        console.log("check bpo" ,req.params.bootcampId ,req.user.id )
        //check id exist or not
        const bootcampCheck = await Bootcamp.findById(req.params.bootcampId)
        if(!bootcampCheck){
            console.log("Bootcamp not found");
            next();
            
        }
        //match author bootcamp or not
        if(!bootcampCheck.user.toString() !== req.user.id && req.user.role !== "admin" ){
            next();
            console.log("author not create course not match");
        }
        const courseData = await course.create(req.body); 
        console.log("course data import")
        res.status(200).json(courseData)
    } catch (error) {
        next(error);
    }

}

//update by id
exports.updateCourse = async(req,res,next)=>{
    try {
        //check id exist or not
        let courseCheck = await course.findById(req.params.courseId)
        if(!courseCheck){
            console.log("Bootcamp not found");
        }
        if(!courseCheck.user.toString() !== req.user.id && req.user.role !== "admin" ){
            next();
            console.log("author not create course not match");
        }
        courseCheck = await course.findByIdAndUpdate(req.params.courseId, req.body,{
            new : true,
            runValidators : true
         }); 
        console.log("course data import")
        res.status(200).json(courseCheck)
    } catch (error) {
        next(error);
    }
}

    //delete
exports.deleteCourse = async(req,res,next)=>{
    try {
        //check id exist or not
        let bootcampCheck = await Bootcamp.findById(req.params.bootcampId)
        if(!bootcampCheck){
            console.log("Bootcamp not found");
        }
        await bootcampCheck.remove();
        console.log("course delete import")
        res.status(200).json({"data":{}})
    } catch (error) {
        next(error);
    }
}