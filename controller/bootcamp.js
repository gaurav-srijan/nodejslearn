
const path = require('path');
const Bootcamp =  require('../module/bootcamp');
const asyncHandler = require('../middleware/async');
//bootcamp
exports.Getfunction=async(req,res,next)=>{
    let query = JSON.stringify(req.query);
    //console.log("check query1" , query);

    query = query.replace(/\b(gt|gte|lt|lte|in)\b/g , match=>`$${match}`);
    //console.log("check query2" , query);

    try {
        let usersave  = Bootcamp.find(JSON.parse(query)).populate('courses')
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
        const total = await Bootcamp.countDocuments();   
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
    res.status(201).json({"paginate":Paginate , "response" : response});
    } catch (error) {
        next(error)
    }
}
//create bootcamp controller
exports.createBootcamp = async(req,res,next)=>{
    try {
        //check id exist or not
        const checkUserPostExist = await Bootcamp.find({user: req.user.id})
        if(checkUserPostExist && req.user.roll !== 'admin'){
            console.log("Publisher already created post")
        }
        req.body.user = req.user.id;
        console.log("check id exist",  req.body.user)
        const bootcampCheck = await Bootcamp.create(req.body)
        if(!bootcampCheck){
            console.log("Bootcamp not create");
        }
        console.log("course data import")
        res.status(200).json(bootcampCheck)
    } catch (error) {
        next(error);
    }

}  
//image upload function
exports.imageUpload=async(req,res,next)=>{
    const FIle_Upload = './public/uploads';
    const File_Size = 100000;
    try {
        console.log("check")
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            console.log("id not exist")
        }
        //make sure user is owen bootcamp
        if(!bootcamp.user.toString() !== req.user.id && req.user.role !== "admin" ){
            console.log("author not create course not match");
        }

        if(!req.files){
            console.log("upload file first")
        }
        const file = req.files.file;
        if(!file.mimetype.startsWith('image')){
            console.log("upload file image")
        }
        if(file.size > File_Size ){
            console.log("upload file image size to large")
        }
        //filenamecrrate
        file.name = `photo${bootcamp._id}${path.parse(file.name).ext}`
        file.mv(`${FIle_Upload}/${file.name}` , async error=>{
            if(error){
                console.log("error occur" , error)
            }
            await Bootcamp.findByIdAndUpdate(req.params.id , {photo : file.name})
        })
        console.log("console.log check file data" , file.name )
    // res.status(201).send(usersave)
}
  catch (error) {
   next(error)
    }
}
    