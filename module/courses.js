const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
titel :{
    type: String,
    trim : true,
    required:[true , "Enter name"]
} , 
discription :{
    type: String,
    required:[true , "Enter discription"]
},
weeks :{
    type: String,
    required:[true , "Enter weeks"]
},
tuition :{
    type: String,
    required:[true , "Enter tuition"]
},
minimumSkill :{
    type: String,
    required:[true , "Enter minimumSkill"],
    enum : ['beginner' , 'intermediate' , 'advanced'] 
},
scholarShip:{
    type : Boolean , 
    default: false
},
createAt:{
    type : Date , 
    default: Date.now
},
bootcamp:{
    type : mongoose.Schema.ObjectId ,
    ref : "Bootcamp" ,
    required: true
},
user:{
    type : mongoose.Schema.ObjectId ,
    ref : "User" ,
    required: true
}
})
//static
// courseSchema.static.getAverageCost  = async function(bootcampId){
//     console.log("xdnckdnckjdcnd")
//     const obj = await this.aggregate([
//         {
//             $match : {bootcamp : bootcampId}
//         },{
//         $group:{
//             _id : '$bootcamp',
//             averageCost: { $avg: '$tuition'}
//         }
//         }
//     ])
//     console.log("data" , obj)
            
// }
// //getAverageCost
// courseSchema.post('save' ,  function(){
// this.constructor.getAverageCost(this.bootcamp);
// })
// // remove getAverageCost
// courseSchema.pre('remove' , function(){
//     this.constructor.getAverageCost(this.bootcamp);
// })

const CourseModel = mongoose.model("Course" , courseSchema )

module.exports = CourseModel;