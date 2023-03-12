const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connect = require('./config/db');

//load env vars
dotenv.config();

//load model file
const Bootcamp =  require('./module/bootcamp')
const CourseModel =  require('./module/courses')
const User = require('./module/users')
//connection db
connect();

//readjson file
const jsonData = JSON.parse(fs.readFileSync(`${__dirname}/jsondata/bootcamps.json`) );
const jsonCourse = JSON.parse(fs.readFileSync(`${__dirname}/jsondata/course.json`) );
const userData = JSON.parse(fs.readFileSync(`${__dirname}/jsondata/user.json`) );
//readjson file
const jsonDataReview = JSON.parse(fs.readFileSync(`${__dirname}/jsondata/bootcamps.json`) );


//import Db
const importData = async () => {
    try {
        await Bootcamp.create(jsonData);
        await CourseModel.create(jsonCourse);
        await User.create(userData);
        console.log("Data imported");
        process.exit();

    } catch (error) {
        console.log("Error importing" , error);
    }
}


//delte import
const DeleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await User.deleteMany();
        await CourseModel.deleteMany();
        console.log("Data deleteMany");
        process.exit();

    } catch (error) {
        console.log("Error importing" , error);
    }
}

if(process.argv[2] === '-i'){
    importData()

}else if(process.argv[2] === '-d'){
    DeleteData()
}else if(process.argv[2] === '-c'){
    importCourseData()
}

