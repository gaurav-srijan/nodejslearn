const User =  require('../module/userModel');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/Error');
const sendNodeMailer = require('../utils/nodemailer');
const crypto = require('crypto');
const Joi = require('joi');
//const validator = require('express-joi-validation').createValidator({})
exports.createUser = asyncHandler(async(req,res,next)=>{


  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });
   const {value ,error} = schema.validate(req.body.email);
   console.log("check email value" , error);
           const user = await User.create(req.body);

        if(!user){
            return  next(new ErrorResponse(`user error: ${error.message}` , 401));
        }
        cookieAssign(user,res)
    } )
        
    
//user login
exports.loginUser = asyncHandler( async(req,res,next)=>{
        const {email , password} = req.body
        if(!email && !password){
            return  next(new ErrorResponse(`enter user mail and password` , 400));
        }
       //check user exist or not
       const userCheck = await User.findOne({email:email}).select("+password")
       if(!userCheck){
        return  next(new ErrorResponse(`user email details not valid :` , 400));
       }
       const matchpass = await userCheck.verifyPassword(password)
       if(!matchpass){
        return  next(new ErrorResponse(` user password details not match :` , 400));
       }
       cookieAssign(userCheck,res)
    
}
)
//after login get info
exports.getMe =  asyncHandler( async(req,res,next)=>{
       const userData = await User.findById(req.user.id)
       if(!userData){
        return  next(new ErrorResponse(` user details : not found` , 400));
       }
       res.status(201).json({"data":"success" , "userInfo" : userData});
})
//send forget link 
exports.forgetPassword = asyncHandler( async(req,res,next)=>{
    const {email}  = req.body;
    //get user details by email
       const userData = await User.findOne({email : email})
       if(!userData){
        return  next(new ErrorResponse(` user email not exist ` , 400));
       }
       //set reshRefresh token 
    const reset = userData.resetToken();
    await userData.save({validateBeforeSave : false})
    //url build
    const resetUrl = `${req.protocol}://${req.get('host')}/user/resetpassword/${reset}`;
    const message = `you can receive password reset password ${resetUrl}`
       await sendNodeMailer({
        email : userData.email,
        subject : 'Password reset password',
        message
       })
       res.status(201).json({"data":"success" , "userInfo" : "sent email"});
})
exports.resetPassword = asyncHandler( async(req,res,next)=>{

        const {password} = req.body; 
        const {reset} = req.params;
        const resetVerify = crypto.createHash('sha256').update(reset).digest('hex');
        const Usercheck = await User.findOne({resetPassworkToken : resetVerify ,
            resetPassworkExpire: {$gt : Date.now()} 
        });
        if(!resetVerify){
            return  next(new ErrorResponse(`reset passwordtoken not match  ` , 401));
        }
        //set new password
        Usercheck.password = password;
        Usercheck.resetPassworkToken = undefined;
        Usercheck.resetPassworkExpire = undefined;
        await Usercheck.save({validateBeforeSave : false});
        cookieAssign(Usercheck,res)

})


    exports.updateUserDetails = asyncHandler( async(req,res,next)=>{
        //  const {email , name} = req.body;
         const user = await User.findByIdAndUpdate(req.user.id , req.body)
         if(!user){
            return next(new ErrorResponse(`user not found` , 404));
         }
         res.status(201).json({
            "status" :"success",
            "user" : "update"
         })

    })

    exports.updatePassword = asyncHandler( async(req,res,next)=>{
         const user = await User.findById(req.user.id ).select('+password')
         console.log("check user information", user)
         if(!user){
            return next(new ErrorResponse(`user not found ` , 400));
         }
         //check password is match
         if(!(await user.matchPassword(req.body.currentPassword))){
            console.log(" user  password not match cuddent password",)
            return next(new ErrorResponse(`" user  password not match cuddent password" ` , 400));
         }
         user.password = req.body.newPassword
         await user.save()
         res.status(201).json({
            "status" :"success",
            "user" : "password update successfully"
         })

    })

const cookieAssign=asyncHandler((user,res)=>{
    const token  = user.getSignedJwtToken();
    const option ={
           maxAge: 1000 * 60 * 15, // would expire after 15 minutes
           httpOnly: true, // The cookie only accessible by the web server
    }
    if(!token){
        return  next(new ErrorResponse(`token error  : ${error.message}` , 401));
    }
    res.status(201).cookie("toekn" , token ,option).json({"data":"success" , "token" : token});
    })
