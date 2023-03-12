const User =  require('../module/userModel');
const asyncHandler = require('../middleware/async');
const jsonwebtoken = require('jsonwebtoken');
exports.protect = async (req,res,next)=>{
    let token;
        try {
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
                 token = req.headers.authorization.split(' ')[1];
                 //console.log("check",token)
                 if(!token){
                    console.log("token not valid");
                }
                const decode = jsonwebtoken.verify(token , "dcdcdcdcfuvnu");
                if(!decode){
                    console.log("auth  not valid");
                }
                req.user = await User.findById(decode.id)
                // console.log("auth successful" , req.user)
                next();
            }
            else{
                console.log("auth not pass");
            }
        } catch (error) {
            console.log("Authentication failed" ,error);
        }
}
exports.roleCheck = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            console.log("this role not valid " ,error);
        }
        next();
    }

}