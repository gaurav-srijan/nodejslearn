const express= require('express');
const path = require('path');
const app = express();
var cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload');
let PORT = 4000;
const connect = require('./config/db');
const morgan = require('morgan');
const bootcamp = require('./route/bootcamp');
const course = require('./route/course');
const user = require('./route/user');
const admin = require('./route/admin');
const error = require('./middleware/error');
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(fileupload())

//set static folder
app.use(express.static(path.join(__dirname,"public")));
//db connection
connect();
app.use(bootcamp)
app.use(course)
app.use(user)
app.use(admin)
app.use(error)
app.use('*',(error)=>{
    console.log("isisisiisis",error.message);
})

app.listen(PORT, ()=>{
    console.log("its work");
})

